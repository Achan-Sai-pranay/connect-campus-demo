import React from "react";
import "../styles/XPHeader.css";

/**
 * Accepts either:
 *  - props.userXP (preferred) and props.userLevel
 *  - or props.xp for backward compatibility
 */
const XPHeader = ({ userXP, userLevel, xp }) => {
  const safeXP = Number(userXP ?? xp ?? 0) || 0;
  // prefer provided level, otherwise compute from XP
  const level = userLevel ?? Math.floor(safeXP / 100) + 1;
  const nextLevelXP = level * 100;
  // progress inside current level (0-100)
  const progress = Math.min(100, Math.max(0, ((safeXP % 100) / 100) * 100));

  return (
    <div className="xp-header">
      <div className="level-info">
        <div className="level-title">Level {level}</div>
        <div className="xp-count">
          {safeXP} / {nextLevelXP} XP
        </div>
      </div>

      <div className="xp-bar-container" aria-hidden>
        <div className="xp-bar">
          <div className="xp-progress" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default XPHeader;
