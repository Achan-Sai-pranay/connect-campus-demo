import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="nav-logo">CampusConnect+</h2>
      </div>

      <div className="nav-center">
        <NavLink
          to="/skills"
          className={({ isActive }) =>
            `nav-btn ${isActive ? "active" : ""}`
          }
        >
          Skills Hub
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `nav-btn ${isActive ? "active" : ""}`
          }
        >
          Projects
        </NavLink>

        <NavLink
          to="/productivity"
          className={({ isActive }) =>
            `nav-btn ${isActive ? "active" : ""}`
          }
        >
          Productivity
        </NavLink>
      </div>

      <div className="nav-right">
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
