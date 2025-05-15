import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>
        You are logged in as an <strong>Admin</strong>
      </p>
      {/* Admin-specific content */}
      <div>
        <p>Admin Settings</p>
        {/* Admin specific actions */}
      </div>
    </div>
  );
}
