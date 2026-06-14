import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7084";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Простая обработка 401/403, без автоповтора
    return Promise.reject(error);
  }
);

