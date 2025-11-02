// src/components/Topbar.jsx
import React from "react";
import "../styles/Topbar.css";

const Topbar = ({ onAddClick }) => {
  return (
    <div className="topbar">
      <div>
        <h2>Skill & Resource Exchange</h2>
        <p>Share knowledge, earn XP</p>
      </div>
      <button className="add-btn" onClick={onAddClick}>
        + Post Skill
      </button>
    </div>
  );
};

export default Topbar;
