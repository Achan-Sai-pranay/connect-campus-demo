import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login Successful ✅");
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form">
        <h2>Login</h2>

        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button className="login-btn" onClick={handleSubmit}>Login</button>

        <p className="no-account">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;