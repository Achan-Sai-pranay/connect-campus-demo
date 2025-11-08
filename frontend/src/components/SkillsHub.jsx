import React, { useEffect, useState } from "react";
import XPHeader from "./XPHeader";
import SkillCard from "./SkillCard";
import SkillModal from "./SkillModal";
import Leaderboard from "./Leaderboard";
import API_BASE_URL from "../utils/api";    // ✅ Make sure this import exists
import "../styles/SkillsHub.css";

const SkillsHub = () => {
  const currentUser = "You";

  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  // ✅ Load data once
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("skillsHub_users")) || [
      { rank: 1, name: "Alex Chen", level: 12, xp: 2850 },
      { rank: 2, name: "Sarah Kumar", level: 11, xp: 2640 },
      { rank: 3, name: "Mike Johnson", level: 11, xp: 2420 },
      { rank: 4, name: "Emma Davis", level: 10, xp: 2180 },
      { rank: 5, name: currentUser, level: 9, xp: 1850 },
    ];
    setUsers(savedUsers);

    fetch(`${API_BASE_URL}/api/skills`)
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((err) => console.error("Error fetching skills", err));
  }, []);

  // ✅ Backend → Create skill
  const handleAddSkill = async (skill) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: skill.title,
          description: skill.description,
          postedBy: currentUser,
        }),
      });

      const created = await res.json();
      setSkills((prev) => [created, ...prev]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error adding skill:", err);
    }
  };

  // Accept request
  const handleAcceptRequest = async (id, accepter) => {
    const updated = skills.map((s) =>
      s._id === id && s.status === "open"
        ? { ...s, status: "accepted", acceptedBy: accepter }
        : s
    );
    setSkills(updated);
  };

  // Complete request
  const handleCompleteRequest = async (id) => {
    const updated = skills.map((s) =>
      s._id === id ? { ...s, status: "completed" } : s
    );
    setSkills(updated);
  };

  // XP update (still local until backend ready)
  const handleXpUpdate = (userName, xpGain) => {
    const updated = users.map((u) =>
      u.name === userName
        ? {
            ...u,
            xp: u.xp + xpGain,
            level: Math.floor((u.xp + xpGain) / 100) + 1,
          }
        : u
    );
    setUsers(updated);
    localStorage.setItem("skillsHub_users", JSON.stringify(updated));
  };

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
            <h2>All Help Requests</h2>
            <button className="request-btn" onClick={() => setIsModalOpen(true)}>
              + Request Help
            </button>
          </div>

          {skills.length === 0 ? (
            <p className="empty-state">No requests yet. Click “Request Help”.</p>
          ) : (
            <div className="skills-list">
              {skills.map((skill) => (
                <SkillCard
                  key={skill._id}
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
            users={[...users]
              .sort((a, b) => b.xp - a.xp)
              .map((u, i) => ({ ...u, rank: i + 1 }))}
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
