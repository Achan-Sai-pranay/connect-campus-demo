import React, { useState } from "react";
import XPHeader from "./XPHeader";
import SkillCard from "./SkillCard";
import SkillModal from "./SkillModal";
import Leaderboard from "./Leaderboard";
import "../styles/SkillsHub.css";

const SkillsHub = () => {
  const currentUser = "You";

  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState([
    { rank: 1, name: "Alex Chen", level: 12, xp: 2850 },
    { rank: 2, name: "Sarah Kumar", level: 11, xp: 2640 },
    { rank: 3, name: "Mike Johnson", level: 11, xp: 2420 },
    { rank: 4, name: "Emma Davis", level: 10, xp: 2180 },
    { rank: 5, name: currentUser, level: 9, xp: 1850 },
  ]);

  // Add a new help request (from SkillModal)
  const handleAddSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: Date.now(),
      postedBy: currentUser,
      status: "open",
      acceptedBy: null,
    };
    setSkills((prev) => [newSkill, ...prev]);
  };

  // Accept a request
  const handleAcceptRequest = (id, accepter) => {
    setSkills((prev) =>
      prev.map((s) =>
        s.id === id && s.status === "open"
          ? { ...s, status: "accepted", acceptedBy: accepter }
          : s
      )
    );
  };

  // Mark completed (call end)
  const handleCompleteRequest = (id) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "completed" } : s))
    );
  };

  // Update XP for a user (single source of truth here)
  const handleXpUpdate = (userName, xpGain) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.name === userName
          ? { ...u, xp: u.xp + xpGain, level: Math.floor((u.xp + xpGain) / 100) + 1 }
          : u
      )
    );
  };

  // XPHeader data from currentUser
  const currentUserData = users.find((u) => u.name === currentUser);
  const userXP = currentUserData ? currentUserData.xp : 0;
  const userLevel = currentUserData ? currentUserData.level : 1;

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
            <p className="empty-state">No requests yet. Click “Request Help” to start!</p>
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
            users={[...users].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }))}
          />
        </div>
      </div>

      {isModalOpen && <SkillModal onAddSkill={handleAddSkill} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default SkillsHub;
