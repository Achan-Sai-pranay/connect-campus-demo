import React from "react";
import "../styles/Leaderboard.css";

const Leaderboard = ({ users = [] }) => {
  const normalized = users.map((u) => ({ name: u.name, xp: Number(u.xp || 0) }));
  const sorted = [...normalized].sort((a, b) => b.xp - a.xp).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="leaderboard">
      <h3>🏆 Leaderboard</h3>
      <div className="leaderboard-list">
        {sorted.map((user) => (
          <div key={user.name} className={`leaderboard-item ${user.name === "You" ? "you" : ""}`}>
            <div className="rank-badge">{user.rank}</div>
            <div className="user-info">
              <p className="username">{user.name}</p>
              <span className="level">Level {Math.floor(user.xp / 100) + 1}</span>
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
