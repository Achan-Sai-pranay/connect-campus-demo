import React, { useEffect, useState } from "react";
import PomodoroTimer from "./PomodoroTimer";
import ProductivityAnalytics from "./ProductivityAnalytics";
import "../styles/Productivity.css";

const STORAGE_KEY = "campus_productivity_final_v1";

export default function Productivity() {
  const [state, setState] = useState({
    durationMinutes: 25,
    isRunning: false,
    sessionStart: null, // timestamp ms
    timeLeft: 25 * 60, // seconds
    topic: "",
    sessions: [], // completed sessions [{id, topic, duration, fp}]
    focusPoints: 0,
    completedSessions: 0,
  });

  // Load state once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const savedState = JSON.parse(raw);
        const loadedState = {
            ...savedState,
            durationMinutes: Number(savedState.durationMinutes || 25),
            focusPoints: Number(savedState.focusPoints || 0),
            completedSessions: Number(savedState.completedSessions || 0),
            sessions: savedState.sessions.map(s => ({
                ...s, 
                duration: Number(s.duration) 
            }))
        };
        setState(loadedState);
      }
    } catch (err) {
      console.warn("Failed to parse productivity storage", err);
    }
  }, []);

  // Persist state on ALL state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (window.BroadcastChannel) {
        const ch = new BroadcastChannel("campus_prod_channel");
        ch.postMessage({ type: "sync", payload: state });
        ch.close();
      } else {
        localStorage.setItem("campus_prod_sync_ts", Date.now().toString());
      }
    } catch (err) {
      console.warn("Failed to persist productivity", err);
    }
  }, [state]); 

  // Cross-tab sync (Unchanged)
  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const remote = JSON.parse(e.newValue);
          setState((cur) => ({ ...cur, ...remote }));
        } catch {}
      }
      if (e.key === "campus_prod_sync_ts") {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setState((cur) => ({ ...cur, ...JSON.parse(raw) }));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    let bc = null;
    if (window.BroadcastChannel) {
      bc = new BroadcastChannel("campus_prod_channel");
      bc.onmessage = (m) => {
        if (m.data && m.data.type === "sync" && m.data.payload) {
          setState((cur) => ({ ...cur, ...m.data.payload }));
        }
      };
    }

    return () => {
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, []);

  // helper to partially update state
  const updateState = (patch) => setState((s) => ({ ...s, ...patch }));

  // Called when PomodoroTimer notifies a completed session
  const handleSessionComplete = (minutesRecorded, topicText) => {
    const recordedMins = Number(minutesRecorded); 
    
    let finalMins = recordedMins;
    if (finalMins <= 0) {
        if (state.isRunning) {
            finalMins = 0.01; 
        } else {
            return; 
        }
    }
    
    if (isNaN(finalMins) || finalMins < 0) return;

    const fp = Math.round(finalMins * 2);
    const session = {
      id: Date.now(),
      topic: topicText || "Unknown",
      duration: finalMins, 
      fp,
    };

    setState(s => ({
        ...s,
        sessions: [session, ...s.sessions],
        completedSessions: s.completedSessions + 1,
        focusPoints: s.focusPoints + fp,
        isRunning: false,
        sessionStart: null,
        timeLeft: s.durationMinutes * 60,
        topic: "", 
    }));
  };

  // Reset everything
  const handleResetAll = () => {
    if (!window.confirm("Are you sure you want to reset ALL progress (sessions, points, etc.)? This cannot be undone.")) {
        return;
    }
    const base = {
      durationMinutes: 25,
      isRunning: false,
      sessionStart: null,
      timeLeft: 25 * 60,
      topic: "",
      sessions: [],
      focusPoints: 0,
      completedSessions: 0,
    };
    setState(base);
  };

  return (
    <div className="productivity-container">
      <div className="productivity-top">
        <h1 className="productivity-title" style={{ display: 'inline' }}>Productivity Suite</h1>
        {/* FIX: Move subtitle inline for single-line display */}
        <p className="productivity-subtitle" style={{ display: 'inline', marginLeft: '10px' }}>
          Boost your Focus Points (FP) by completing Pomodoro sessions.
        </p>
      </div>

      <div className="prod-tab-row" style={{ display: 'none' }}>
        {/* FIX: Hide the redundant tab row */}
        <div className="tab-left">
          <button className="tab-btn active">Pomodoro</button>
        </div>
      </div>

      {/* FIX: Removed maxWidth from prod-main-grid style to allow it to spread */}
      <div className="prod-main-grid" style={{ width: "100%" }}> 
        <div className="prod-left">
          <PomodoroTimer
            durationMinutes={state.durationMinutes}
            isRunning={state.isRunning}
            sessionStart={state.sessionStart}
            timeLeft={state.timeLeft}
            topic={state.topic}
            onChange={(patch) => updateState(patch)}
            onComplete={(mins, t) => handleSessionComplete(mins, t)}
          />
          <div className="prod-local-controls" style={{ display: "flex", gap: "10px", marginTop: "16px", alignItems: "center", flexWrap: "wrap" }}>
              <button className="btn btn-reset" onClick={handleResetAll}>Reset All Progress</button>
              <button className="btn" onClick={() => window.open(window.location.href + "?mini=true", "_blank", "width=420,height=640")}>
                  Open Mini Timer
              </button>
              <p className="muted" style={{ marginTop: 0, flexBasis: '100%', fontSize: '0.85rem' }}>Tip: open a mini window if you want a visible timer while browsing other sites.</p>
          </div>
        </div>

        <aside className="prod-right">
          <div className="sidebar-card">
            <h3>Today's Progress</h3>
            <div className="sidebar-row">
              <div className="muted">Sessions Completed</div>
              <div className="bold">{state.completedSessions}</div>
            </div>

            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${Math.min(100, (state.completedSessions / 8) * 100)}%` }} />
            </div>

            <div className="sidebar-row" style={{ marginTop: 12 }}>
              <div className="muted">XP Progress</div>
              <div className="bold">{state.focusPoints % 100} / 100</div>
            </div>
            <div className="bar-bg">
              <div className="bar-fill" style={{ width: `${state.focusPoints % 100}%` }} />
            </div>
          </div>

          <div className="sidebar-card" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Recent Activity</h3>
            </div>

            <div style={{ marginTop: 12 }}>
              {state.sessions.length === 0 ? (
                <div className="muted">No activity yet. Complete a session to see it here.</div>
              ) : (
                <div className="recent-list">
                  {state.sessions.slice(0, 6).map((s) => (
                    <div key={s.id} className="recent-item">
                      <div><strong>{s.topic}</strong></div>
                      <div className="muted">{Number(s.duration).toFixed(2)} min • +{s.fp} FP</div> 
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-card" style={{ marginTop: 16 }}>
             <ProductivityAnalytics sessions={state.sessions} />
          </div>
          
        </aside>
      </div>
    </div>
  );
}