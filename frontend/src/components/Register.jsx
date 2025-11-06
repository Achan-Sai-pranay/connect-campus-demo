import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api";
import "../styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match ❌" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Registration Successful ✅ Redirecting..." });
        localStorage.setItem("token", data.token);

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Registration failed!" });
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage({
        type: "error",
        text: `Connection failed ❌ Backend not reachable at: ${API_BASE_URL}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        {message && (
          <p className={message.type === "success" ? "success-message" : "error-message"}>
            {message.text}
          </p>
        )}

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <button type="submit" className="register-btn" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>

        <p className="switch-text">
          Already have an account? <Link to="/login" className="switch-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
