import { createBrowserRouter, Navigate } from "react-router-dom";

// Ensure this path is correct based on your file structure
import Login from "../AdminPanel/Pages/Login/Login";
// Other imports for layouts and pages are intentionally removed for this temporary simplification.

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login-test" replace />,
  },
  {
    path: "/login-test",
    element: <Login />,
  },
  // All other admin routes, ProtectedRoute, AdminPanelLayout related routes
  // are removed for this temporary test.
]);

export default router;
