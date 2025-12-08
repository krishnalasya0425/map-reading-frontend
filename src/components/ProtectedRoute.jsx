import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // optionally save role on login

  if (!token) return <Navigate to="/login" />;

  if (role && role !== userRole) return <Navigate to="/login" />;

  return children;
}
