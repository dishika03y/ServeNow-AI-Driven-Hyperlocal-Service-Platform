import axios, { AxiosRequestConfig } from "axios";


const BASE_URL = "http://192.168.10.142:8000";

const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    if (error.response) {
      throw new Error(error.response.data?.detail || "Request failed");
    } else {
      throw new Error("Network error. Check backend.");
    }
  }
}

export default API;