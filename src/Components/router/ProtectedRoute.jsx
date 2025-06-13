// src/Components/router/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth'; // Changed to named import

const ProtectedRoute = () => {
  const auth = useAuth(); // Call the hook to get the object
  const isAuthenticated = auth.isAuthenticated; // Access the function from the hook's return object

  if (!isAuthenticated()) { // Use the function correctly
    // User not authenticated, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
