// src/auth/useAuth.js
import axiosInstance from "../api/axiosInstance";

const useAuth = () => {
  const login = async (email, password) => {
    try {
      // Path is relative to VITE_API_BASE_URL
      const response = await axiosInstance.post("/auth/admin/login", {
        email,
        password,
      });

      if (response.data && response.data.authToken && response.data.admin) {
        localStorage.setItem("adminAuthToken", response.data.authToken);
        localStorage.setItem("adminUser", JSON.stringify(response.data.admin));
        localStorage.removeItem("staffUser"); // Clear any previous staff session
        return {
          success: true,
          userType: "admin",
          userData: response.data.admin,
        };
      } else if (
        response.data &&
        response.data.authToken &&
        response.data.staff
      ) {
        localStorage.setItem("adminAuthToken", response.data.authToken); // Or a different token key like 'staffAuthToken'
        localStorage.setItem("staffUser", JSON.stringify(response.data.staff));
        localStorage.removeItem("adminUser"); // Clear any previous admin session
        return {
          success: true,
          userType: "staff",
          userData: response.data.staff,
        };
      }
      // Fallback if response structure is unexpected for successful login
      return {
        success: false,
        message:
          response.data?.message ||
          "Login failed: Unexpected response structure.",
      };
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "Login failed: No response from server.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("Login error in useAuth:", error);
      return { success: false, message: errorMessage };
    }
  };

  const logout = (navigateCallback) => {
    localStorage.removeItem("adminAuthToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("staffUser"); // Also clear staff if stored
    if (navigateCallback) navigateCallback();
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("adminAuthToken");
    // TODO: Add token expiration check for more robust auth
    return !!token;
  };

  const getCurrentUser = () => {
    // Corrected function name syntax
    const userStr = localStorage.getItem("adminUser"); // Prioritize admin for admin panel
    if (userStr) return JSON.parse(userStr);
    const staffStr = localStorage.getItem("staffUser"); // Fallback or alternative for staff
    if (staffStr) return JSON.parse(staffStr);
    return null;
  };

  const getUserType = () => {
    if (localStorage.getItem("adminUser")) return "admin";
    if (localStorage.getItem("staffUser")) return "staff";
    return null;
  };

  return {
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    getUserType,
  };
};

export { useAuth }; // Keep as named export
