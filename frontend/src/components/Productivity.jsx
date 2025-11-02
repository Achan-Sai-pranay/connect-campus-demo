import React, { useState, useEffect, useRef } from "react";
import "../styles/Productivity.css";

const Productivity = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [topic, setTopic] = useState("");
  const [sessions, setSessions] = useState([]);
  const [focusPoints, setFocusPoints] = useState(0);
  const [focusLevel, setFocusLevel] = useState(1);
  const [sessionStart, setSessionStart] = useState(null);
  const timerRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("productivityData"));
    if (savedData) {
      setTimeLeft(savedData.timeLeft);
      setIsRunning(savedData.isRunning);
      setCompletedSessions(savedData.completedSessions);
      setSessions(savedData.sessions);
      setFocusPoints(savedData.focusPoints);
      setFocusLevel(savedData.focusLevel);
      setSessionStart(savedData.sessionStart);
    }
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem(
      "productivityData",
      JSON.stringify({
        timeLeft,
        isRunning,
        completedSessions,
        sessions,
        focusPoints,
        focusLevel,
        sessionStart,
      })
    );
  }, [timeLeft, isRunning, completedSessions, sessions, focusPoints, focusLevel, sessionStart]);

  // Timer logic (real-time persistent)
  useEffect(() => {
    if (isRunning && sessionStart) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        const remaining = 25 * 60 - elapsed;
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          handleCompleteSession();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, sessionStart]);

  const handleStartStop = () => {
    if (isRunning) {
      handleCompleteSession();
    } else {
      setSessionStart(Date.now() - (25 * 60 - timeLeft) * 1000);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setSessionStart(null);
  };

  const handleCompleteSession = () => {
    const duration = (25 * 60 - timeLeft) / 60;
    const gainedFP = Math.round(duration * 2);
    if (topic.trim() !== "") {
      const newSession = {
        id: Date.now(),
        topic,
        duration: duration.toFixed(2),
        fp: gainedFP,
      };
      const updatedSessions = [newSession, ...sessions];
      const totalFP = focusPoints + gainedFP;

      setSessions(updatedSessions);
      setCompletedSessions((prev) => prev + 1);
      setFocusPoints(totalFP);
      setFocusLevel(Math.floor(totalFP / 100) + 1);
    }
    setIsRunning(false);
    setSessionStart(null);
    setTimeLeft(25 * 60);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;
  const fpProgress = (focusPoints % 100);

  return (
    <div className="productivity-container">
      <div className="productivity-header">
        <h1 className="productivity-title">Productivity Suite</h1>
        <p className="productivity-subtitle">
          Boost your <span className="highlight">Focus Points (FP)</span> by completing Pomodoro sessions.
          <br />Stay consistent to <span className="highlight">level up your focus!</span>
        </p>
      </div>

      <div className="top-section">
        <div className="focus-info">
          <p className="focus-level">Focus Level {focusLevel}</p>
          <div className="fp-bar-container">
            <div
              className="fp-bar-fill"
              style={{ width: `${fpProgress}%` }}
            ></div>
          </div>
          <p className="fp-text">{focusPoints} FP</p>
        </div>

        <div className="pomodoro-section">
          <input
            type="text"
            placeholder="Enter topic (e.g. DSA Notes)"
            className="topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <div className="pomodoro-timer">
            <svg className="timer-ring" width="260" height="260">
              <circle className="timer-bg" cx="130" cy="130" r="110" />
              <circle
                className="timer-progress"
                cx="130"
                cy="130"
                r="110"
                strokeDasharray="690"
                strokeDashoffset={690 - (progress / 100) * 690}
              />
            </svg>
            <div className="timer-display">
              {minutes}:{seconds}
            </div>
          </div>

          <div className="controls">
            <button
              onClick={handleStartStop}
              className={`btn ${isRunning ? "btn-stop" : "btn-start"}`}
            >
              {isRunning ? "Stop & Record" : "Start"}
            </button>
            <button onClick={handleReset} className="btn btn-reset">
              Reset
            </button>
          </div>
          <p className="completed-text">Completed Sessions: {completedSessions}</p>
        </div>
      </div>

      <div className="recent-section">
        <h3 className="recent-title">Recent Sessions</h3>
        <div className="session-scroll">
          {sessions.length === 0 ? (
            <p className="no-sessions">No sessions yet. Start a Pomodoro to begin!</p>
          ) : (
            <ul className="session-list">
              {sessions.map((s) => (
                <li key={s.id} className="session-item">
                  🕓 <strong>{s.topic}</strong> — {s.duration} min (+{s.fp} FP)
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productivity;
