import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page with the intended destination
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
