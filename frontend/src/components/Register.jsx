import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import API_BASE_URL from "../utils/api";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  /** ✅ NORMAL FORM REGISTER */
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match ❌" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Registration Successful ✅ Redirecting...",
        });

        localStorage.setItem("token", data.token);

        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ type: "error", text: data.message || "Something went wrong" });
      }
    } catch {
      setMessage({
        type: "error",
        text: `Connection failed. Check your backend at: ${API_BASE_URL}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** ✅ GOOGLE SIGN UP */
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const response = await fetch(`${API_BASE_URL}/auth/google-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: googleUser.displayName,
          email: googleUser.email,
        }),
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google Signup Error:", error);
      setMessage({ type: "error", text: "Google sign-in failed ❌" });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">

        {/* LEFT SIDE FORM */}
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Create Account</h2>

          {message && (
            <p className={message.type === "success" ? "success-message" : "error-message"}>
              {message.text}
            </p>
          )}

          <div className="input-container">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-container">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* ✅ RIGHT SIDE GOOGLE SIGNUP */}
        <div className="google-container">
          <p className="already-account">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          <div className="divider">or</div>

          <button className="google-btn" onClick={handleGoogleSignup}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google Icon" />
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
};

export default Register;
