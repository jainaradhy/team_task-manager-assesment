import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? "http://localhost:5001/api" : `${window.location.origin}/api`);

if (!import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not set. Falling back to window.location.origin + '/api'. This will only work if the backend is hosted on the same origin."
  );
}

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttm_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
