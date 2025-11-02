import React from "react";
import "../styles/SkillCard.css";

const SkillCard = ({ skill, currentUser, onAccept, onComplete }) => {
  const isPostedByUser = skill.postedBy === currentUser;
  const isAcceptedByUser = skill.acceptedBy === currentUser;

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
          Posted by:{" "}
          <strong>
            {isPostedByUser ? `${skill.postedBy} (You)` : skill.postedBy}
          </strong>
        </span>

        {/* Button Logic */}
        {skill.status === "completed" ? (
          <span className="completed-text">✅ Session Completed</span>
        ) : isPostedByUser && skill.status === "open" ? (
          <span className="your-post">📬 Waiting for help...</span>
        ) : skill.status === "open" ? (
          <button className="accept-btn" onClick={() => onAccept(skill.id)}>
            Accept
          </button>
        ) : isAcceptedByUser && skill.status === "accepted" ? (
          <button className="complete-btn" onClick={() => onComplete(skill.id)}>
            Mark Complete
          </button>
        ) : (
          <span className="accepted-by">
            ✅ Accepted by <strong>{skill.acceptedBy}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default SkillCard;
