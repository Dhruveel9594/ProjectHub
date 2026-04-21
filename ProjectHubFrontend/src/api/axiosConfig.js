// src/api/axiosConfig.js
// ─────────────────────────────────────────────────────────────
//  Reads base URL from environment variable so the same code
//  works in both local dev and production without changes.
//
//  Local:      VITE_API_BASE_URL = http://localhost:8090/api
//  Production: VITE_API_BASE_URL = https://projecthub-backend.onrender.com/api
// ─────────────────────────────────────────────────────────────

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8090/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — log out and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;