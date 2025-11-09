import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import SkillsHub from "./components/SkillsHub";
import Productivity from "./components/Productivity";
import Projects from "./components/Projects";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./App.css";

const AppContent = () => {
  const location = useLocation(); // detects current route

  // Routes where navbar should NOT appear
  const hideNavbarRoutes = ["/login", "/register"];

  return (
    <div className="app-container">
      {/* ✅ Conditionally render navbar */}
      {!hideNavbarRoutes.includes(location.pathname.toLowerCase()) && <Navbar />}

      <Routes>
        <Route path="/" element={<SkillsHub />} />
        <Route path="/skills" element={<SkillsHub />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* corrected lowercase */}
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;

