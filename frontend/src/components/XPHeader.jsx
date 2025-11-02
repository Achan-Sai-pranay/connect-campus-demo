// src/components/XPHeader.jsx
import React from "react";
import "../styles/XPHeader.css";

const XPHeader = ({ xp = 1850, nextLevelXP = 2500 }) => {
  const progress = Math.min((xp / nextLevelXP) * 100, 100).toFixed(1);

  return (
    <div className="xp-header">
      <div className="xp-left">
        <p className="xp-title">Level 9</p>
        <div className="xp-bar">
          <div className="xp-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="xp-count">{xp} / {nextLevelXP} XP</span>
      </div>
      <div className="xp-right">
        <img
          src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
          alt="avatar"
          className="avatar"
        />
      </div>
    </div>
  );
};

export default XPHeader;
