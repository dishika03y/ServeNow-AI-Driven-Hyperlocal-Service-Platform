import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const BASE_URL = "http://192.168.1.10:8000";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let isRedirecting = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const handleAuthFailure = async () => {
  if (isRedirecting) return;
  isRedirecting = true;

  try {
    await AsyncStorage.multiRemove([
      "access_token",
      "refresh_token",
      "userProfile",
    ]);
    router.replace("/auth/login");
  } finally {
    setTimeout(() => {
      isRedirecting = false;
    }, 2000);
  }
};

// --- Request Interceptor ---
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response Interceptor ---
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Fixed: Don't try to refresh if the call was actually to the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (!refreshToken) {
        await handleAuthFailure();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return API(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use a clean axios instance for refresh to avoid interceptor loops
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.access_token;
        await AsyncStorage.setItem("access_token", newAccessToken);

        API.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        await handleAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Global API Request Helper
 * INDUSTRY FIX: We now throw the ACTUAL error object so the UI can read status codes.
 */

export async function apiRequest<T = any>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> {
  // Ensure the URL starts with a slash
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  try {
    const response = await API({
      url: cleanUrl, // Use cleanUrl
      method,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (__DEV__) {
      console.log(`[DEBUG] Full URL: ${BASE_URL}${cleanUrl}`);
      console.log(`[API Error]:`, error.response?.data || error.message);
    }
    throw error;
  }
}

export default API;