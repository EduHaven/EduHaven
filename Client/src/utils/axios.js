import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          toast.error("Please login again");
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${backendUrl}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;

        localStorage.setItem("token", token);

        // Update the authorization header
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;

        processQueue(null, token);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear tokens and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Redirect to login page
        window.location.href = "/auth/login";
        toast.error("Token expired: Please Login Again");

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
