import React, { useEffect, useState } from "react";
import XPHeader from "./XPHeader";
import SkillCard from "./SkillCard";
import SkillModal from "./SkillModal";
import SessionCompleteModal from "./SessionCompleteModal";
import Leaderboard from "./Leaderboard";
import API_BASE_URL from "../utils/api";
import "../styles/SkillsHub.css";

const SkillsHub = () => {
  const currentUser = "You";

  const [skills, setSkills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(null); // { xpGain }

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("skillsHub_users")) || [
      { rank: 1, name: "Alex Chen", level: 12, xp: 2850 },
      { rank: 2, name: "Sarah Kumar", level: 11, xp: 2640 },
      { rank: 3, name: "Mike Johnson", level: 11, xp: 2420 },
      { rank: 4, name: "Emma Davis", level: 10, xp: 2180 },
      { rank: 5, name: currentUser, level: 9, xp: 1850 },
    ];
    setUsers(savedUsers);

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/skills`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn("Error fetching skills - fallback sample:", err);
        setSkills([
          { _id: "local-1", title: "dbms", description: "normals", postedBy: "You", status: "open", xp: 50, acceptedBy: null },
          { _id: "local-2", title: "React help", description: "hooks issue", postedBy: "You", status: "open", xp: 50, acceptedBy: null },
        ]);
      }
    })();
  }, []);

  // add skill (same fallback logic)
  const handleAddSkill = async (skill) => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: skill.title, description: skill.description, postedBy: currentUser }),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setSkills((p) => [created, ...p]);
    } catch (err) {
      const local = { _id: skill._id || `local-${Date.now()}`, title: skill.title, description: skill.description, postedBy: currentUser, status: "open", xp: skill.xp || 50, acceptedBy: null };
      setSkills((p) => [local, ...p]);
    } finally {
      setIsModalOpen(false);
    }
  };

  // accept
  const handleAcceptRequest = async (id, accepter) => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills/${id}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acceptedBy: accepter }),
      });
      if (!res.ok) throw new Error("Accept failed");
      const updated = await res.json();
      setSkills((p) => p.map((s) => (s._id === updated._id || s.id === updated._id ? updated : s)));
    } catch (err) {
      setSkills((p) => p.map((s) => ((s._id === id || s.id === id) ? { ...s, status: "accepted", acceptedBy: accepter } : s)));
    }
  };

  // complete
  const handleCompleteRequest = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/skills/${id}/complete`, { method: "PUT", headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error("Complete failed");
      const updated = await res.json();
      setSkills((p) => p.map((s) => (s._id === updated._id || s.id === updated._id ? updated : s)));
    } catch (err) {
      setSkills((p) => p.map((s) => ((s._id === id || s.id === id) ? { ...s, status: "completed" } : s)));
    }
  };

  const handleXpUpdate = (userName, xpGain) => {
    const updated = users.map((u) => u.name === userName ? { ...u, xp: u.xp + xpGain, level: Math.floor((u.xp + xpGain) / 100) + 1 } : u);
    const exists = updated.some((u) => u.name === userName);
    const final = exists ? updated : [...updated, { name: userName, xp: xpGain, level: Math.floor(xpGain / 100) + 1 }];
    const sorted = final.sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));
    setUsers(sorted);
    localStorage.setItem("skillsHub_users", JSON.stringify(sorted));
  };

  const currentUserData = users.find((u) => u.name === currentUser);
  const userXP = currentUserData ? currentUserData.xp : 0;
  const userLevel = currentUserData ? currentUserData.level : 1;

  // show session complete modal callback from SkillCard
  const handleShowSessionComplete = ({ xpGain }) => {
    setSessionComplete({ xpGain });
    // auto-hide after 3.5s if you like; keep it manual for now
    // setTimeout(() => setSessionComplete(null), 3500);
  };

  return (
    <div className="skills-hub-container">
      <XPHeader userXP={userXP} userLevel={userLevel} />

      <div className="skills-hub-content">
        <div className="skills-section">
          <div className="skills-header">
            <h2>All Help Requests</h2>
            <button className="request-btn" onClick={() => setIsModalOpen(true)}>+ Request Help</button>
          </div>

          {skills.length === 0 ? (
            <p className="empty-state">No requests yet. Click “Request Help”.</p>
          ) : (
            <div className="skills-list">
              {skills.map((skill) => (
                <SkillCard
                  key={skill._id || skill.id}
                  skill={skill}
                  currentUser={currentUser}
                  onAccept={handleAcceptRequest}
                  onComplete={handleCompleteRequest}
                  onXpUpdate={handleXpUpdate}
                  onShowSessionComplete={handleShowSessionComplete}
                />
              ))}
            </div>
          )}
        </div>

        <div className="leaderboard-section">
          <Leaderboard users={[...users].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }))} />
        </div>
      </div>

      {isModalOpen && <SkillModal onAddSkill={handleAddSkill} onClose={() => setIsModalOpen(false)} />}

      {sessionComplete && (
        <SessionCompleteModal
          xpGain={sessionComplete.xpGain}
          onClose={() => setSessionComplete(null)}
        />
      )}
    </div>
  );
};

export default SkillsHub;
