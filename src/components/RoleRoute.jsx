import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

const ROLE_HOME = { admin: "/admin", caregiver: "/caregiver", client: "/portal" };

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  }

  return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
}