// src/components/SkillModal.jsx
import React, { useState } from "react";
import "../styles/SkillModal.css";

const SkillModal = ({ onAddSkill, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const newSkill = {
      id: Date.now(),
      type: "request",
      title,
      description,
      xp: 50,
      postedBy: "You",
      status: "open",
      acceptedBy: null,
    };

    onAddSkill(newSkill);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Request Help</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g., Need help with Normal Forms"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            rows="4"
            placeholder="Describe what exactly you need help with."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="modal-actions">
            <button type="submit" className="submit-btn">
              Request Help
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillModal;
