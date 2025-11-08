import React, { useEffect, useState } from "react";
import PomodoroTimer from "./PomodoroTimer";
import ProductivityAnalytics from "./ProductivityAnalytics";
import API_BASE_URL from "../utils/api";
import "../styles/Productivity.css";

export default function Productivity() {
  const [state, setState] = useState({
    durationMinutes: 25,
    isRunning: false,
    sessionStart: null,
    timeLeft: 25 * 60,
    topic: "",
    sessions: [],
    focusPoints: 0,
    completedSessions: 0,
  });

  const updateState = (patch) => setState((s) => ({ ...s, ...patch }));

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/sessions`);
        const data = await res.json();
        setState((s) => ({
          ...s,
          sessions: data.sessions,
          focusPoints: data.totalFP,
          completedSessions: data.completedSessions,
        }));
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      }
    };
    fetchSessions();
  }, []);

  const handleSessionComplete = async (minutesRecorded, topicText) => {
    let duration = Number(minutesRecorded);
    if (duration <= 0) duration = 0.01;

    const newSession = { topic: topicText || "Unknown", duration };

    try {
      const res = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      const savedSession = await res.json();

      updateState((s) => ({
        ...s,
        sessions: [savedSession, ...s.sessions],
        completedSessions: s.completedSessions + 1,
        focusPoints: s.focusPoints + savedSession.fp,
        isRunning: false,
        sessionStart: null,
        timeLeft: s.durationMinutes * 60,
        topic: "",
      }));
    } catch (err) {
      console.error("Failed to save session", err);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm("Are you sure you want to reset all progress?")) return;

    try {
      await fetch(`${API_BASE_URL}/sessions`, { method: "DELETE" });
      setState({
        durationMinutes: 25,
        isRunning: false,
        sessionStart: null,
        timeLeft: 25 * 60,
        topic: "",
        sessions: [],
        focusPoints: 0,
        completedSessions: 0,
      });
    } catch (err) {
      console.error("Failed to reset sessions", err);
    }
  };

  return (
    <div className="productivity-container">
      <div className="productivity-top">
        <h1 className="productivity-title" style={{ display: "inline" }}>Productivity Suite</h1>
        <p className="productivity-subtitle" style={{ display: "inline", marginLeft: "10px" }}>
          Boost your Focus Points (FP) by completing Pomodoro sessions.
        </p>
      </div>

      <div className="prod-main-grid" style={{ width: "100%" }}>
        <div className="prod-left">
          <PomodoroTimer
            durationMinutes={state.durationMinutes}
            isRunning={state.isRunning}
            sessionStart={state.sessionStart}
            timeLeft={state.timeLeft}
            topic={state.topic}
            onChange={(patch) => updateState(patch)}
            onComplete={handleSessionComplete}
          />

          <div className="prod-local-controls" style={{ display: "flex", gap: "10px", marginTop: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn btn-reset" onClick={handleResetAll}>Reset All Progress</button>
            <button className="btn" onClick={() => window.open(window.location.href + "?mini=true", "_blank", "width=420,height=640")}>
              Open Mini Timer
            </button>
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
            <h3>Recent Activity</h3>
            <div style={{ marginTop: 12 }}>
              {state.sessions.length === 0 ? (
                <div className="muted">No activity yet. Complete a session to see it here.</div>
              ) : (
                <div className="recent-list">
                  {state.sessions.slice(0, 6).map((s) => (
                    <div key={s._id} className="recent-item">
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
