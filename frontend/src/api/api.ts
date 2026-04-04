import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://serservenow-backend.onrender.com";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Automatically attach Token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRequest<T = any>(
  url: string,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE" = "GET",
  data?: any,
  config?: AxiosRequestConfig,
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
    if (error.response) {
      // Pulls the error message from your FastAPI/Node backend
      throw new Error(error.response.data?.detail || "Request failed");
    } else {
      throw new Error("Network error. Check backend.");
    }
  }
}

export default API;
