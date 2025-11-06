import React from "react";
import "../styles/ProjectCard.css";

/**
 * ProjectCard shows summary info and quick task + button actions.
 * Props:
 *  - project: object
 *  - onView: fn() open details
 *  - onTaskChange: fn({ completed, total, deltaTasksCompleted })
 */
export default function ProjectCard({ project, onView, onTaskChange }) {
  const { title, status, progress, hours, xp, team, tasks } = project;

  const incTask = () => {
    if (!onTaskChange) return;
    const newCompleted = Math.min(tasks.total, tasks.completed + 1);
    const delta = newCompleted - tasks.completed;
    onTaskChange({ completed: newCompleted, total: tasks.total, deltaTasksCompleted: delta });
  };

  const decTask = () => {
    if (!onTaskChange) return;
    const newCompleted = Math.max(0, tasks.completed - 1);
    const delta = newCompleted - tasks.completed; // negative or 0
    onTaskChange({ completed: newCompleted, total: tasks.total, deltaTasksCompleted: delta });
  };

  return (
    <div
      className={`project-card ${
        status === "active" ? "active" : status === "completed" ? "completed" : "planning"
      }`}
    >
      <div className="project-header">
        <h3>{title}</h3>
        <span className={`status ${status}`}>{status}</span>
      </div>

      <div className="progress-section">
        <p>Progress</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progress-value">{progress}%</span>
      </div>

      <div className="stats">
        <div>
          <p>Hours</p>
          <span>{Math.round(hours * 10) / 10}</span>
        </div>
        <div>
          <p>XP Earned</p>
          <span className="xp">{xp}</span>
        </div>
      </div>

      <div className="team-section">
        <p>Team ({team.length})</p>
        <div className="avatars">
          {team.map((m, i) => (
            <div className="avatar" key={i}>
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="tasks-row">
        <p className="tasks">
          {tasks.completed}/{tasks.total} tasks completed
        </p>
        <div className="task-controls">
          <button className="task-btn" onClick={decTask} aria-label="decrease task">
            −
          </button>
          <button className="task-btn" onClick={incTask} aria-label="increase task">
            +
          </button>
        </div>
      </div>

      <button className="details-btn" onClick={onView}>
        View Details
      </button>
    </div>
  );
}
