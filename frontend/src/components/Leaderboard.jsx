import React, { useEffect, useState } from "react";
import "../styles/Leaderboard.css";

const Leaderboard = ({ userXP = 1850 }) => {
  const [users, setUsers] = useState([
    { rank: 1, name: "Alex Chen", level: 12, xp: 2850 },
    { rank: 2, name: "Sarah Kumar", level: 11, xp: 2640 },
    { rank: 3, name: "Mike Johnson", level: 11, xp: 2420 },
    { rank: 4, name: "Emma Davis", level: 10, xp: 2180 },
    { rank: 5, name: "You", level: 9, xp: userXP },
  ]);

  // Auto-update leaderboard if XP changes (simulate dynamic behavior)
  useEffect(() => {
    setUsers((prev) => {
      const updated = prev.map((u) =>
        u.name === "You" ? { ...u, xp: userXP } : u
      );

      // sort descending by XP
      const sorted = [...updated].sort((a, b) => b.xp - a.xp);

      // reassign ranks
      return sorted.map((u, i) => ({ ...u, rank: i + 1 }));
    });
  }, [userXP]);

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard</h3>
      <div className="leaderboard-list">
        {users.map((user) => (
          <div
            key={user.name}
            className={`leaderboard-item ${user.name === "You" ? "you" : ""}`}
          >
            <div className="rank-badge">{user.rank}</div>
            <div className="user-info">
              <p className="username">{user.name}</p>
              <span className="level">Level {user.level}</span>
            </div>
            <div className="xp">
              <span>{user.xp}</span>
              <span className="xp-text">XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
