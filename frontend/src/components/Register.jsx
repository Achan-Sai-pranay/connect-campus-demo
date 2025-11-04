import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration Successful ✅");
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form">
        <h2>Create Account</h2>

        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />

        <button className="register-btn" onClick={handleRegister}>Register</button>

        <p className="switch-text">
          Already have an account? <Link to="/login" className="switch-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
