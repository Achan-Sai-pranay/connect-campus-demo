import React, { useState } from "react";
import "../styles/SkillModal.css";

const SkillModal = ({ onAddSkill, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    const newSkill = {
      // use _id so components expecting backend-like object don't break
      _id: `local-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Need help with Normal Forms"
          />

          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what exactly you need help with."
          />

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
