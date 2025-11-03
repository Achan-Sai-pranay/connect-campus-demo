import React from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-form">
        <h2>Login</h2>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
          alt="login illustration"
          className="auth-illustration"
        />


        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button className="login-btn">Login</button>

        <p className="no-account">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;