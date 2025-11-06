import React, { useState } from "react";
import "../styles/NewProjectModal.css";

export default function NewProjectModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("planning");
  const [team, setTeam] = useState("");
  const [tasksTotal, setTasksTotal] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newProject = {
      title: title.trim(),
      status,
      team: team
        .split(",")
        .map((m) => m.trim().toUpperCase())
        .filter(Boolean),
      tasksTotal: Number(tasksTotal) || 10,
    };
    onSave(newProject);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Project</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter project title" />

          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <label>Team Members (comma separated)</label>
          <input value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. Y, A, S" />

          <label>Total Tasks</label>
          <input type="number" min="1" value={tasksTotal} onChange={(e) => setTasksTotal(e.target.value)} />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-btn">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
