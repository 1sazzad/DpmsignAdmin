// import { useState, useEffect } from 'react'; // Keep if you add state for user object
import axiosInstance from '../api/axiosInstance';

const useAuth = () => {
  // Optional: store user object in state if needed across components
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   // Optionally load user from localStorage if token exists and is valid (e.g. by calling a /me endpoint)
  //   const token = localStorage.getItem('adminAuthToken');
  //   if (token) {
  //     // To fully re-hydrate, you might want to call a /me endpoint here
  //     // For now, isAuthenticated just checks token presence.
  //   }
  // }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('adminAuthToken', response.data.token);
        // if (response.data.admin) {
        //   localStorage.setItem('adminUser', JSON.stringify(response.data.admin)); // Optional
        //   // setUser(response.data.admin); // Optional
        // }
        return { success: true, admin: response.data.admin };
      }
      // This case might not be reached if backend always returns error for failed login
      return { success: false, message: 'Login failed: No token received' };
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Login failed: No response from server. Please check your network connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error('Login error in useAuth:', error);
      return { success: false, message: errorMessage };
    }
  };

  const logout = (navigateCallback) => { // navigateCallback is passed from component
    localStorage.removeItem('adminAuthToken');
    // localStorage.removeItem('adminUser'); // Optional: if you stored user details
    // setUser(null); // Optional

    // It's good practice to also inform the backend if it has a /logout endpoint
    // axiosInstance.post('/auth/logout').catch(err => console.error("Logout API call failed", err));

    if (navigateCallback) navigateCallback();
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('adminAuthToken');
    // TODO: Add token expiration check for more robust auth by decoding the token
    return !!token;
  };

  // Optional: function to get current user details from localStorage
  // const getCurrentUser = () => {
  //   const userStr = localStorage.getItem('adminUser');
  //   return userStr ? JSON.parse(userStr) : null;
  // };

  return {
    login,
    logout,
    isAuthenticated,
    // getCurrentUser, // Optional
    // user // Optional: if you manage user state here
  };
};

export default useAuth;
