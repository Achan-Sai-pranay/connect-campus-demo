import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SkillsHub from "./components/SkillsHub";
import Productivity from "./components/Productivity";
import Projects from "./components/Projects";
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <Routes>
          <Route path="/" element={<SkillsHub />} />
          <Route path="/skills" element={<SkillsHub />} />
          <Route path="/productivity" element={<Productivity />} />
          <Route path="/projects" element={<Projects />} />

          {/* ✅ Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} /> {/* <-- fixed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
