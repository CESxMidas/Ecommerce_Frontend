import axios from "axios";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getStoredUser() {
  try {
    const stored = localStorage.getItem("user");

    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

apiClient.interceptors.request.use((config) => {
  const user = getStoredUser();

  if (!config.skipAuth && user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

let refreshPromise = null;

async function refreshAccessToken() {
  const user = getStoredUser();

  if (!user?.refreshToken) {
    throw new Error("Not authorized");
  }

  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL || "/api"}${API_ENDPOINTS.auth.refresh}`,
    { refreshToken: user.refreshToken },
    { withCredentials: true },
  );

  const updatedUser = {
    ...user,
    ...data,
    token: data.token,
    refreshToken: data.refreshToken,
  };

  saveStoredUser(updatedUser);

  return updatedUser.token;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const token = await refreshPromise;
        refreshPromise = null;
        original.headers.Authorization = `Bearer ${token}`;

        return apiClient(original);
      } catch {
        refreshPromise = null;
        localStorage.removeItem("user");
      }
    }

    const apiError = new Error(
      error.response?.data?.message ||
      error.message ||
      "Request failed"
    );

    apiError.status = error.response?.status;
    apiError.data = error.response?.data;

    return Promise.reject(apiError);
  },
);

export default apiClient;
