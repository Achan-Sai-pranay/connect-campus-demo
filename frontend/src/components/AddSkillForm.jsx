import React, { useState } from "react";
import "../styles/AddSkillForm.css";

const AddSkillForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "Teaching",
    title: "",
    tags: "",
    xp: 50,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const payload = {
      _id: `local-${Date.now()}`,
      type: formData.type,
      title: formData.title.trim(),
      xp: Number(formData.xp) || 50,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      postedBy: "You",
    };
    onSave(payload);
  };

  return (
    <div className="form-overlay">
      <div className="form-box">
        <h3>Post a New Skill</h3>
        <form onSubmit={handleSubmit}>
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option>Teaching</option>
            <option>Learning</option>
          </select>

          <label>Title:</label>
          <input name="title" placeholder="e.g., React Patterns" value={formData.title} onChange={handleChange} />

          <label>Tags (comma separated):</label>
          <input name="tags" placeholder="React, Frontend" value={formData.tags} onChange={handleChange} />

          <label>XP:</label>
          <input name="xp" type="number" placeholder="50" value={formData.xp} onChange={handleChange} />

          <div className="form-buttons">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillForm;
