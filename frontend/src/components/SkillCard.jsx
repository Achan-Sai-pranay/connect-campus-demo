import React, { useState } from "react";
import CallModal from "./CallModal";
import "../styles/SkillCard.css";

const SkillCard = ({
  skill,
  onAccept,
  onComplete,
  currentUser,
  onXpUpdate,
}) => {
  const [isCallOpen, setIsCallOpen] = useState(false);

  // Called when CallModal triggers onEndCall (only one peer should award XP)
  const handleEndCall = () => {
    // Only the helper (acceptedBy) performs XP awarding to avoid duplicates
    const helper = skill.acceptedBy;
    const requester = skill.postedBy;

    if (!helper || !requester) {
      // if data missing still mark complete locally
      onComplete(skill.id);
      setIsCallOpen(false);
      return;
    }

    if (currentUser === helper) {
      // helper finishes the session -> award to both
      if (onXpUpdate) {
        onXpUpdate(helper, 100);     // helper +100
        onXpUpdate(requester, 33);   // requester +33
      }
    }

    // mark session completed (idempotent)
    if (onComplete) onComplete(skill.id);
    setIsCallOpen(false);
  };

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <h3>{skill.title}</h3>
        <span
          className={`skill-type ${
            skill.status === "completed"
              ? "completed"
              : skill.status === "accepted"
              ? "accepted"
              : "request"
          }`}
        >
          {skill.status.charAt(0).toUpperCase() + skill.status.slice(1)}
        </span>
      </div>

      <p className="skill-desc">{skill.description}</p>

      <div className="skill-footer">
        <span className="posted-by">
          Posted by: <strong>{skill.postedBy === currentUser ? `${skill.postedBy} (You)` : skill.postedBy}</strong>
        </span>

        {skill.status === "completed" ? (
          <span className="completed-text">✅ Session Completed</span>
        ) : skill.status === "open" ? (
          skill.postedBy !== currentUser ? (
            <button className="accept-btn" onClick={() => onAccept(skill.id, currentUser)}>
              Accept
            </button>
          ) : (
            <span className="your-post">📬 Waiting for help...</span>
          )
        ) : skill.status === "accepted" ? (
          // show Join Session to both participants (acceptedBy and poster)
          (skill.acceptedBy === currentUser || skill.postedBy === currentUser) ? (
            <button className="accept-btn" onClick={() => setIsCallOpen(true)}>
              Join Session
            </button>
          ) : (
            <span className="accepted-by">✅ Accepted by <strong>{skill.acceptedBy}</strong></span>
          )
        ) : null}
      </div>

      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        sessionId={skill.id}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

export default SkillCard;
