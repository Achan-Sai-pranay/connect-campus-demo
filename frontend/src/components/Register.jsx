import { Link } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  return (
    <div className="register-wrapper">
      <form className="register-form">
        <h2>Create Account</h2>

        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />

        <button className="register-btn">Register</button>

        <p className="switch-text">
          Already have an account?
          <Link to="/login" className="switch-link"> Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
