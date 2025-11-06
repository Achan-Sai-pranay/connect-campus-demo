import React, { useState } from "react";
import XPHeader from "./XPHeader";
import SkillCard from "./SkillCard";
import SkillModal from "./SkillModal";
import Leaderboard from "./Leaderboard";
import "../styles/SkillsHub.css";

const SkillsHub = () => {
  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userXP, setUserXP] = useState(1850);
  const [userLevel, setUserLevel] = useState(9);
  const currentUser = "You";

  const handleAddSkill = (skill) => setSkills((prev) => [skill, ...prev]);

  const handleAcceptSkill = (id) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id && s.status === "open"
          ? { ...s, status: "accepted", acceptedBy: currentUser }
          : s
      )
    );
  };

  const handleCompleteSkill = (id) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;

    // XP update only if YOU are the helper
    if (skill.acceptedBy === currentUser) {
      const newXP = userXP + 50;
      setUserXP(newXP);
      setUserLevel(Math.floor(newXP / 100) + 1);
    }

    setSkills((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "completed" } : s
      )
    );
  };

  return (
    <div className="skills-hub-container">
      <XPHeader userXP={userXP} userLevel={userLevel} />

      <div className="skills-hub-content">
        {/* LEFT FEED */}
        <div className="skills-section">
          <div className="skills-header">
            <div>
              <h2>All Help Requests</h2>
              <p>See who’s asking for what & collaborate</p>
            </div>

            <button className="request-btn" onClick={() => setIsModalOpen(true)}>
              + Request Help
            </button>
          </div>

          {skills.length === 0 ? (
            <p className="empty-state">
              No requests yet. Click “Request Help” to start!
            </p>
          ) : (
            <div className="skills-list">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  currentUser={currentUser}
                  onAccept={handleAcceptRequest}
                  onComplete={handleCompleteRequest}
                  onXpUpdate={handleXpUpdate}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT LEADERBOARD */}
        <div className="leaderboard-section">
          <Leaderboard
            users={[
              { rank: 1, name: "Alex Chen", level: 12, xp: 2850 },
              { rank: 2, name: "Sarah Kumar", level: 11, xp: 2640 },
              { rank: 3, name: "Mike Johnson", level: 11, xp: 2420 },
              { rank: 4, name: "Emma Davis", level: 10, xp: 2180 },
              { rank: 5, name: currentUser, level: userLevel, xp: userXP },
            ]}
          />
        </div>
      </div>

      {isModalOpen && (
        <SkillModal
          onAddSkill={handleAddSkill}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SkillsHub;
