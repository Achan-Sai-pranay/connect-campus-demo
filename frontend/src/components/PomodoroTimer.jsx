import React, { useEffect, useRef, useState } from "react";
import "../styles/PomodoroTimer.css";

/**
 * Controlled PomodoroTimer with local editing to avoid input flicker.
 * Props:
 * - durationMinutes, isRunning, sessionStart, timeLeft, topic
 * - onChange(patch) -> partial update to parent
 * - onComplete(minutesRecorded, topic) -> tells parent a session finished
 */
export default function PomodoroTimer({
  durationMinutes = 25,
  isRunning = false,
  sessionStart = null,
  timeLeft = 25 * 60,
  topic = "",
  onChange = () => {},
  onComplete = () => {},
}) {
  const [localDuration, setLocalDuration] = useState(durationMinutes);
  const [localTopic, setLocalTopic] = useState(topic);
  const [, setNow] = useState(Date.now());
  const tickRef = useRef(null);
  
  // Ref for the duration value used by the timer logic
  const durationRef = useRef(durationMinutes);
  durationRef.current = durationMinutes;

  // Sync local state with parent props
  useEffect(() => {
    if (!isRunning || durationMinutes !== localDuration) {
        setLocalDuration(durationMinutes);
    }
  }, [durationMinutes, isRunning]);

  useEffect(() => {
    setLocalTopic(topic || "");
  }, [topic]);

  // Tick interval setup
  useEffect(() => {
    if (isRunning) {
        if (tickRef.current) clearInterval(tickRef.current);
        tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    } else {
        clearInterval(tickRef.current);
    }
    return () => clearInterval(tickRef.current);
  }, [isRunning]);

  // --- Timer Calculation Logic ---
  const totalSeconds = Math.max(1, Math.round(durationRef.current * 60));
  let remaining = timeLeft;
  if (isRunning && sessionStart) {
    const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
    remaining = Math.max(0, totalSeconds - elapsed);
  } else {
    remaining = typeof timeLeft === "number" ? timeLeft : totalSeconds;
  }

  // Formatting
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  
  // Progress calculation
  const progress = Math.min(100, Math.round(((totalSeconds - remaining) / totalSeconds) * 100));

  // --- Handlers ---
  const handleStart = () => {
    const now = Date.now();
    let sessionStartTs;
    if (isRunning) return; 

    if (remaining < totalSeconds && remaining > 0) {
        sessionStartTs = now - (totalSeconds - remaining) * 1000;
    } else {
        sessionStartTs = now; 
    }

    onChange({
      durationMinutes: localDuration, 
      isRunning: true,
      sessionStart: sessionStartTs,
      timeLeft: remaining > 0 ? remaining : Math.round(localDuration * 60), 
      topic: localTopic,
    });
  };

  const handlePause = () => onChange({ isRunning: false, sessionStart: null, timeLeft: remaining });

  const handleReset = () => onChange({ isRunning: false, sessionStart: null, timeLeft: Math.round(localDuration * 60) });

  const handleStopRecord = () => {
    const recordedMinutes = (totalSeconds - remaining) / 60;
    // Call onComplete to update parent state and record the session
    onComplete(recordedMinutes, localTopic); 
  };

  // Auto-complete detection
  useEffect(() => {
    if (isRunning && remaining <= 0) {
      onComplete(durationMinutes, localTopic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, isRunning, durationMinutes]); 

  // Local duration change logic
  const onLocalDurationChange = (val) => {
    if (val === "") {
      setLocalDuration("");
      return;
    }
    const n = Number(val);
    if (Number.isNaN(n)) return;
    const clamped = Math.max(1, Math.min(300, Math.floor(n)));
    setLocalDuration(clamped);
  };

  const onDurationBlur = () => {
    const final = Number(localDuration) || 1;
    setLocalDuration(final);
    onChange({ durationMinutes: final, timeLeft: final * 60, isRunning: false, sessionStart: null });
  };

  const onTopicBlur = () => {
    onChange({ topic: localTopic });
  };

  return (
    <div className="pomodoro-card">
      <h2 className="pomodoro-title">Pomodoro Timer</h2>
      <p className="pomodoro-subtext">Focus session — editable length</p>

      <input
        className="topic-input"
        placeholder="Enter topic (e.g. DSA Notes)"
        value={localTopic}
        onChange={(e) => setLocalTopic(e.target.value)}
        onBlur={onTopicBlur}
        disabled={isRunning}
      />

      <div className="duration-row">
        <label className="muted">Session length (minutes)</label>
        <input
          type="number"
          min="1"
          max="300"
          className="duration-input"
          value={localDuration}
          onChange={(e) => onLocalDurationChange(e.target.value)}
          onBlur={onDurationBlur}
          disabled={isRunning}
        />
      </div>

      <div className="ring-wrapper">
        <svg className="progress-ring" width="260" height="260">
          <circle className="ring-bg" cx="130" cy="130" r="110" strokeWidth="12" />
          <circle
            className="ring-progress"
            cx="130"
            cy="130"
            r="110"
            strokeWidth="12"
            strokeDasharray={2 * Math.PI * 110}
            strokeDashoffset={(1 - progress / 100) * 2 * Math.PI * 110}
          />
        </svg>

        <div className="time-display">
          {mm}:{ss}
        </div>
      </div>

      <div className="controls">
        {!isRunning ? (
          <button className="btn start" onClick={handleStart}>
            {remaining < totalSeconds && remaining > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <>
            <button className="btn pause" onClick={handlePause}>
              Pause
            </button>
            <button className="btn stop" onClick={handleStopRecord}>
              Stop & Record
            </button>
          </>
        )}
        <button className="btn reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className="session-info">
        <div className="muted">Completed sessions & recent activity appear in the right sidebar.</div>
      </div>
    </div>
  );
}