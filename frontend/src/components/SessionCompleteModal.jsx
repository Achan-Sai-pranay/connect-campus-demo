import React from "react";
import "../styles/SessionComplete.css";

/**
 * Small modal shown after call ends to confirm XP gained
 * props:
 *  - xpGain: number
 *  - onClose: () => void
 */
const SessionCompleteModal = ({ xpGain = 50, onClose }) => {
  return (
    <div className="session-overlay" role="dialog" aria-modal="true">
      <div className="session-card">
        <h3>Session Complete 🎉</h3>
        <p className="session-text">You earned <strong>+{xpGain} XP</strong> for completing the help session.</p>
        <div className="session-actions">
          <button className="session-btn" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
};

export default SessionCompleteModal;
