import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SkillsHub from "./components/SkillsHub";
import Productivity from "./components/Productivity";
import Projects from "./components/Projects";
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
