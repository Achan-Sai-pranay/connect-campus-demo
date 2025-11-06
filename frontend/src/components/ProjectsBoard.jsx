import React, { useEffect, useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import NewProjectModal from "./NewProjectModal";
import ProjectDetailsModal from "./ProjectDetailsModal";
import "../styles/ProjectsBoard.css";

const STORAGE_KEY = "cc_projects";
const GLOBAL_XP_KEY = "cc_global_xp";
const BROADCAST_NAME = "campusconnect-projects";

const defaultProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    status: "active",
    progress: 65,
    hours: 48,
    xp: 850,
    team: ["Y", "A", "S"],
    tasks: { completed: 8, total: 12 },
  },
  {
    id: 2,
    title: "Mobile Game Prototype",
    status: "active",
    progress: 30,
    hours: 22,
    xp: 420,
    team: ["Y", "M"],
    tasks: { completed: 3, total: 10 },
  },
  {
    id: 3,
    title: "Research Paper - AI Ethics",
    status: "planning",
    progress: 15,
    hours: 8,
    xp: 180,
    team: ["Y", "E", "D", "L"],
    tasks: { completed: 1, total: 8 },
  },
];

export default function ProjectsBoard() {
  const [projects, setProjects] = useState(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : defaultProjects;
  });
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const bcRef = useRef(null);

  // init BroadcastChannel for realtime between tabs
  useEffect(() => {
    if ("BroadcastChannel" in window) {
      bcRef.current = new BroadcastChannel(BROADCAST_NAME);
      bcRef.current.onmessage = (ev) => {
        if (!ev.data) return;
        if (ev.data.type === "projects_update") {
          setProjects(ev.data.payload);
        }
      };
    }

    // storage event fallback
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProjects(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      if (bcRef.current) bcRef.current.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // persist & broadcast when projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    if (bcRef.current) {
      bcRef.current.postMessage({ type: "projects_update", payload: projects });
    }
  }, [projects]);

  // helper: update project
  const upsertProject = (updated) => {
    setProjects((prev) => {
      const found = prev.find((p) => p.id === updated.id);
      let next;
      if (found) {
        next = prev.map((p) => (p.id === updated.id ? updated : p));
      } else {
        next = [...prev, updated];
      }
      return next;
    });
  };

  // add new project
  const addProject = (newProject) => {
    const project = {
      id: Date.now(),
      ...newProject,
      progress: 0,
      hours: 0,
      xp: 0,
      tasks: { completed: 0, total: newProject.tasksTotal || 10 },
    };
    setProjects((p) => {
      const next = [...p, project];
      if (bcRef.current) bcRef.current.postMessage({ type: "projects_update", payload: next });
      return next;
    });
  };

  // increase global xp (SkillHub synchronization)
  const addGlobalXP = (amount) => {
    const cur = Number(localStorage.getItem(GLOBAL_XP_KEY) || 0);
    const next = cur + Number(amount || 0);
    localStorage.setItem(GLOBAL_XP_KEY, String(next));
    // broadcast for other tabs
    if (bcRef.current) bcRef.current.postMessage({ type: "global_xp", payload: next });
  };

  // When a task is completed inside project details or card, update project & xp
  const onTaskChange = ({ projectId, completed, total, deltaTasksCompleted }) => {
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id !== projectId) return p;
        const newCompleted = typeof completed === "number" ? completed : p.tasks.completed;
        const newTotal = typeof total === "number" ? total : p.tasks.total;
        const progress = Math.round((newCompleted / Math.max(1, newTotal)) * 100);
        // xp formula: 25 XP per task completed (per user's request)
        const xpGain = (deltaTasksCompleted || 0) * 25;
        const newXp = Number(p.xp || 0) + xpGain;
        const newStatus = progress >= 100 ? "completed" : p.status;
        const updated = {
          ...p,
          tasks: { completed: newCompleted, total: newTotal },
          progress,
          xp: newXp,
          status: newStatus,
        };
        return updated;
      });
      // add global xp from delta
      if (deltaTasksCompleted && deltaTasksCompleted > 0) {
        addGlobalXP(deltaTasksCompleted * 25);
      }
      if (bcRef.current) bcRef.current.postMessage({ type: "projects_update", payload: next });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // attempt to sync hours automatically from productivity sessions saved to localStorage.
  // expected format: localStorage['cc_productivity_sessions'] = JSON.stringify([{topic:"E-Commerce Platform", minutes:25, timestamp:...}, ...])
  // If sessions exist, sum minutes whose topic matches project title and apply to project's hours (only once)
  useEffect(() => {
    const raw = localStorage.getItem("cc_productivity_sessions");
    if (!raw) return;
    let sessions;
    try {
      sessions = JSON.parse(raw);
    } catch {
      return;
    }
    if (!Array.isArray(sessions) || sessions.length === 0) return;

    // Map project title -> total minutes in sessions that mention that title
    const minutesByProject = {};
    sessions.forEach((s) => {
      if (!s || !s.topic) return;
      const name = s.topic.trim();
      if (!name) return;
      minutesByProject[name] = (minutesByProject[name] || 0) + (Number(s.minutes) || 0);
    });

    // Apply to projects whose title matches the session topic exactly
    setProjects((prev) => {
      let changed = false;
      const next = prev.map((p) => {
        const mins = minutesByProject[p.title];
        if (mins && mins > 0) {
          const additionalHours = mins / 60;
          changed = true;
          return { ...p, hours: Number(p.hours || 0) + additionalHours };
        }
        return p;
      });
      if (changed) {
        if (bcRef.current) bcRef.current.postMessage({ type: "projects_update", payload: next });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
    // Note: we don't delete sessions here; Productivity should manage them.
  }, []); // run once on mount

  const completed = projects.filter((p) => p.status === "completed");
  const active = projects.filter((p) => p.status !== "completed");

  return (
    <div className="projects-board">
      <div className="projects-header">
        <div>
          <h2>Project Collaboration Board</h2>
          <p>Manage teams, track progress, earn XP</p>
        </div>
        <button className="new-project-btn" onClick={() => setShowNewModal(true)}>
          + New Project
        </button>
      </div>

      <div className="projects-grid">
        {active.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onView={() => setSelectedProject(p)}
            onTaskChange={(payload) => onTaskChange({ projectId: p.id, ...payload })}
          />
        ))}
      </div>

      {completed.length > 0 && (
        <>
          <h3 className="completed-title">Completed Projects</h3>
          <div className="projects-grid">
            {completed.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onView={() => setSelectedProject(p)}
                onTaskChange={(payload) => onTaskChange({ projectId: p.id, ...payload })}
              />
            ))}
          </div>
        </>
      )}

      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onSave={(data) => {
            addProject(data);
            setShowNewModal(false);
          }}
        />
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onSave={(updatedProject, xpDelta) => {
            upsertProject(updatedProject);
            if (xpDelta) addGlobalXP(xpDelta);
            setSelectedProject(updatedProject);
          }}
          onTaskChange={(payload) => onTaskChange({ projectId: selectedProject.id, ...payload })}
        />
      )}
    </div>
  );
}
