import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../AdminPanel/Pages/Login/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin/login" replace />,
  },
  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
