import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cs_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("cs_token"));

  function persist(userData, tokenData) {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("cs_user", JSON.stringify(userData));
    localStorage.setItem("cs_token", tokenData);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cs_user");
    localStorage.removeItem("cs_token");
  }

  async function login(email, password) {
    const result = await loginUser(email, password);
    persist(result.user, result.token);
  }

  async function register(fullName, email, password) {
    const result = await registerUser(fullName, email, password);
    persist(result.user, result.token);
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
