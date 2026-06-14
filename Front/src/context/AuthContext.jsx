import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { axiosClient } from "../api/axiosClient";

const AuthContext = createContext(null);

const saveSession = (data, username) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  const userInfo = { username };
  localStorage.setItem("user", JSON.stringify(userInfo));
  return userInfo;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginInFlight = useRef(false);
  const registerInFlight = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    if (loginInFlight.current) {
      return;
    }

    loginInFlight.current = true;
    try {
      const response = await axiosClient.post("/api/auth/login", {
        username,
        password,
      });
      const userInfo = saveSession(response.data, username);
      setUser(userInfo);
    } finally {
      loginInFlight.current = false;
    }
  };

  const register = async (username, password) => {
    if (registerInFlight.current) {
      return;
    }

    registerInFlight.current = true;
    try {
      const response = await axiosClient.post("/api/auth/register", {
        username,
        password,
      });
      const userInfo = saveSession(response.data, username);
      setUser(userInfo);
    } finally {
      registerInFlight.current = false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
