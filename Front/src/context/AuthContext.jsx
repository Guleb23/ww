import React, { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await axiosClient.post("/api/auth/login", {
      username,
      password,
    });
    const data = response.data;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    // В токене есть userId, но проще сохранить из ответа, если он там есть.
    // В текущем API userId возвращается только в refresh-запросе, поэтому
    // будем восстанавливать позже при первом refresh, а пока сохраним username.
    const userInfo = { username };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const register = async (username, password) => {
    await axiosClient.post("/api/auth/register", {
      username,
      password,
    });
    // После регистрации можно сразу логинить
    await login(username, password);
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

