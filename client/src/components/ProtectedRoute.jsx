import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading indicator while checking authentication
  if (loading) {
    return <div>Loading authentication status...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check user role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = `/${user.role}-dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated (and has required role if specified)
  return children;
};

export default ProtectedRoute;
