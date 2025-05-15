import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Assuming you'll rename the CSS file to Login.css

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      // Try to log the user in
      const loggedInUser = await login(email, password);
      const redirectTo = getDefaultRedirect(loggedInUser.role);
      navigate(redirectTo); // Redirect after login
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function getDefaultRedirect(role) {
    switch (role) {
      case "admin":
        return "/admin-dashboard";
      case "organizer":
        return "/organizer-dashboard";
      case "attendee":
        return "/attendee-dashboard";
      default:
        return "/"; // Default to home if no role
    }
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h2>Welcome Back!</h2>
        <p className="login-subtitle">Login to manage your events</p>

        {loginError && <div className="error-message">{loginError}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-button"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
