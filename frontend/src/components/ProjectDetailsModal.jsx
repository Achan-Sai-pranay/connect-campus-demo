import React, { useState } from "react";
import "../styles/ProjectDetailsModal.css";

/**
 * Editable details modal. onSave(updatedProject, xpDelta) called when saving.
 * onTaskChange can be used for immediate task increments (we also support Save).
 */
export default function ProjectDetailsModal({ project, onClose, onSave, onTaskChange }) {
  const [local, setLocal] = useState({
    ...project,
    // copy nested to allow editing
    tasksCompleted: project.tasks.completed,
    tasksTotal: project.tasks.total,
  });

  // track xp added while editing (for manual adjustments)
  const [accumulatedXpFromSession, setAccumulatedXpFromSession] = useState(0);

  const changeField = (key, val) => setLocal((s) => ({ ...s, [key]: val }));

  const incTask = () => {
    const prev = local.tasksCompleted;
    if (prev >= local.tasksTotal) return;
    const nextCompleted = prev + 1;
    setLocal((s) => ({ ...s, tasksCompleted: nextCompleted, progress: Math.round((nextCompleted / s.tasksTotal) * 100) }));
    // immediate handler for ProjectsBoard to compute xp
    if (onTaskChange) onTaskChange({ completed: prev + 1, total: local.tasksTotal, deltaTasksCompleted: 1 });
    setAccumulatedXpFromSession((x) => x + 25);
  };

  const decTask = () => {
    const prev = local.tasksCompleted;
    if (prev <= 0) return;
    const nextCompleted = prev - 1;
    setLocal((s) => ({ ...s, tasksCompleted: nextCompleted, progress: Math.round((nextCompleted / s.tasksTotal) * 100) }));
    if (onTaskChange) onTaskChange({ completed: prev - 1, total: local.tasksTotal, deltaTasksCompleted: -1 });
    setAccumulatedXpFromSession((x) => x - 25);
  };

  const saveAll = () => {
    // compute xp delta between stored xp and new xp (we rely on board's onTaskChange to have added xp already;
    // but if user changed total tasks or hours we might need to adjust)
    const updated = {
      ...project,
      title: local.title,
      status: local.status,
      progress: local.progress,
      hours: Number(local.hours) || 0,
      xp: Number(local.xp) || 0, // xp is updated by task changes already in board; we keep it
      team: local.team || project.team,
      tasks: { completed: local.tasksCompleted, total: local.tasksTotal },
    };

    // call onSave with xp delta (accumulatedXpFromSession) so global xp can be increased if needed
    if (onSave) onSave(updated, accumulatedXpFromSession);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="details-modal">
        <h2>
          <input
            className="inline-title"
            value={local.title}
            onChange={(e) => changeField("title", e.target.value)}
          />
        </h2>

        <div className="status-line">
          <label>Status</label>
          <select value={local.status} onChange={(e) => changeField("status", e.target.value)}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="modal-info">
          <div className="row">
            <label>Progress</label>
            <input type="number" value={local.progress} onChange={(e) => changeField("progress", Number(e.target.value))} />
          </div>

          <div className="row">
            <label>Hours</label>
            <input type="number" step="0.1" value={local.hours} onChange={(e) => changeField("hours", Number(e.target.value))} />
          </div>

          <div className="row">
            <label>XP (project)</label>
            <input type="number" value={local.xp} onChange={(e) => changeField("xp", Number(e.target.value))} />
          </div>

          <div className="row tasks-edit">
            <label>Tasks</label>
            <div className="tasks-edit-controls">
              <button onClick={decTask} className="task-btn">−</button>
              <input type="number" value={local.tasksCompleted} onChange={(e) => {
                const v = Math.max(0, Math.min(Number(local.tasksTotal), Number(e.target.value) || 0));
                // When user edits directly, compute delta and call onTaskChange
                const delta = v - local.tasksCompleted;
                setLocal(s => ({ ...s, tasksCompleted: v, progress: Math.round((v / s.tasksTotal) * 100) }));
                if (onTaskChange && delta !== 0) onTaskChange({ completed: v, total: local.tasksTotal, deltaTasksCompleted: delta });
                setAccumulatedXpFromSession(x => x + delta * 25);
              }} />
              <button onClick={incTask} className="task-btn">+</button>
              <span className="task-total">/ {local.tasksTotal}</span>
            </div>
            <div className="tasks-total-row">
              <label>Total Tasks</label>
              <input type="number" value={local.tasksTotal} min="1" onChange={(e) => {
                const t = Math.max(1, Number(e.target.value) || 1);
                setLocal(s => ({ ...s, tasksTotal: t, progress: Math.round((s.tasksCompleted / t) * 100) }));
              }} />
            </div>
          </div>
        </div>

        <div className="team-section">
          <label>Team Members (comma separated)</label>
          <input value={local.team.join(", ")} onChange={(e) => {
            const arr = e.target.value.split(",").map(x => x.trim()).filter(Boolean);
            setLocal(s => ({ ...s, team: arr }));
          }} />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={saveAll}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
