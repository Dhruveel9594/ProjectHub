// src/context/AuthContext.jsx
// ─────────────────────────────────────────────────────────────
//  IMPORTANT: Update the login() call in LoginPage.jsx
//  to pass whatever fields your API returns.
//  Your API returns: { accessToken, refreshToken, username, email }
//  We store all of it so profile page can use it.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  /**
   * Call this after a successful login.
   * Pass the FULL response object from your API.
   * Your API returns: { accessToken, refreshToken, id, username, email }
   */
  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem("accessToken",  accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user",         JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}