import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      // TODO: Replace with your actual API call
      // This is a mock implementation
      if (email === "admin@example.com" && password === "admin123") {
        const userData = {
          email,
          userType: "admin",
          // Add other user data as needed
        };
        setUser(userData);
        return { success: true, userType: "admin" };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
