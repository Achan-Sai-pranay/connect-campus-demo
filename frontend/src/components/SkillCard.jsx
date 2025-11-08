import React, { useState } from "react";
import VideoCallModal from "./VideoCallModal";
import "../styles/SkillCard.css";

/**
 * SkillCard:
 * - onAccept(id, user) must accept request (can be optimistic)
 * - onComplete(id) marks completed backend (optional)
 * - onXpUpdate(user, xp) updates local leaderboard
 * - onShowSessionComplete({ xpGain }) optional to show session modal from parent
 */
const SkillCard = ({ skill, currentUser, onAccept, onComplete, onXpUpdate, onShowSessionComplete }) => {
  const [isCallOpen, setIsCallOpen] = useState(false);
  const skillId = skill._id || skill.id;

  const handleAccept = async () => {
    await onAccept(skillId, currentUser);
    setIsCallOpen(true);
  };

  const handleSessionEnd = ({ xpGain, skillId: idFromModal }) => {
    // mark complete + award xp
    onComplete(idFromModal || skillId);
    onXpUpdate(currentUser, Number(xpGain || skill.xp || 50));
    // show a small confirmation card (optional)
    onShowSessionComplete?.({ xpGain: Number(xpGain || skill.xp || 50) });
    setIsCallOpen(false);
  };

  const isCompleted = skill.status === "completed";
  const isAccepted = !!skill.acceptedBy;

  return (
    <div className="skill-card" role="article">
      <h3>{skill.title}</h3>
      <p className="skill-desc">{skill.description}</p>
      <p className="skill-meta">Posted by <b>{skill.postedBy ?? "Unknown"}</b></p>

      {!isCompleted && !isAccepted && (
        <button className="accept-btn" onClick={handleAccept}>Accept & Start Call</button>
      )}

      {isAccepted && <p className="your-post">Accepted by {skill.acceptedBy}</p>}

      {isCallOpen && (
        <VideoCallModal
          skill={skill}
          currentUser={currentUser}
          onClose={() => setIsCallOpen(false)}
          onSessionEnd={handleSessionEnd}
        />
      )}
    </div>
  );
};

export default SkillCard;
