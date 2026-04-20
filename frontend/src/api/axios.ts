import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://serservenow-backend.onrender.com";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // ✅ Attach Token Automatically
// API.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("access_token");

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// ✅ Global API handler (clean + reusable)
export async function apiRequest<T = any>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await API({
      url,
      method,
      data,
      ...config,
    });

    return response.data;
  } catch (error: any) {
    console.log("API ERROR:", error?.response || error.message);

    if (error.response) {
      throw new Error(
        error.response.data?.detail ||
        error.response.data?.message ||
        "Request failed"
      );
    } else {
      throw new Error("Network error. Check backend.");
    }
  }
}

export default API;