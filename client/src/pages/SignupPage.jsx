import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee", // Default role
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);

      // Show success message and navigate
      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      // Handle signup error
      const errorMessage = err.response?.data?.error || "Signup failed";
      setSignupError(errorMessage);

      // Optional: log the error for debugging
      console.error("Signup error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <h2>Create Your Account</h2>
        <p className="signup-subtitle">Join our event management platform</p>

        {signupError && <div className="error-message">{signupError}</div>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            required
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            required
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            required
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
