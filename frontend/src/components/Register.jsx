import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../utils/api"; // This imports the (now corrected) URL
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // State for user feedback (better than alert())
  const [message, setMessage] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null); // Clear previous messages
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match ❌" });
      setIsLoading(false);
      return;
    }

    try {
      // The API call uses the imported (and hopefully corrected) URL
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: "Registration Successful! Redirecting..." });
        localStorage.setItem("token", data.token);
        // Navigate after success
        setTimeout(() => {
          navigate("/dashboard"); 
        }, 1500);

      } else {
        // Server responded with an error (e.g., 400 validation error)
        setMessage({ type: 'error', text: data.message || "Registration failed. Please try again." });
      }
    } catch (error) {
      // This is the error you are likely getting now (Network/Connection refused)
      console.error("Network Error:", error);
      setMessage({ 
        type: 'error', 
        text: `Connection failed. Is the backend server running at ${API_BASE_URL}?` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    const className = message.type === 'success' ? 'success-message' : 'error-message';
    return <p className={className}>{message.text}</p>;
  };

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Create Account</h2>

        {renderMessage()} 
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)} 
          disabled={isLoading}
          required 
        />
        {/* ... other inputs (email, password, confirmPassword) ... */}
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          disabled={isLoading}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          disabled={isLoading}
          required
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} 
          disabled={isLoading}
          required
        />

        <button 
          className="register-btn" 
          type="submit"
          disabled={isLoading}
        >
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