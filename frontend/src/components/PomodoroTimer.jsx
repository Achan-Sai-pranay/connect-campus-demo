import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/PomodoroTimer.css"; // 👈 add this line

const PomodoroTimer = ({ onSessionComplete }) => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0 && isActive) {
      completeSession(25);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const completeSession = (duration) => {
    setIsActive(false);
    setTime(25 * 60);
    setCompleted((c) => c + 1);
    onSessionComplete(duration, topic);
    setTopic("");
  };

  const handleStop = () => {
    const elapsed = 25 - Math.floor(time / 60);
    completeSession(elapsed);
  };

  const progress = ((25 * 60 - time) / (25 * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold text-purple-400">Pomodoro Timer</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter topic (e.g. DSA, OS Notes...)"
        className="bg-[#1e1e35] text-gray-200 rounded-lg px-3 py-2 w-64 text-sm outline-none border border-purple-700/30 focus:border-purple-500 transition"
      />

      <motion.div
        className="timer-ring"
        style={{ "--progress": `${progress}%` }}
        animate={{ scale: isActive ? 1.03 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="timer-inner">
          <span className="timer-text">{formatTime(time)}</span>
        </div>
      </motion.div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-5 py-2 rounded-lg text-white ${
            isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-green-600 hover:bg-green-700"
          } transition`}
        >
          {isActive ? "Pause" : "Start"}
        </button>

        <button
          onClick={handleStop}
          className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
        >
          Stop
        </button>

        <button
          onClick={() => setTime(25 * 60)}
          className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
        >
          Reset
        </button>
      </div>

      <p className="text-gray-400 text-sm mt-2">Completed Sessions: {completed}</p>
    </div>
  );
};

export default PomodoroTimer;
