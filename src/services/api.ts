import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://api-user.fams.college/api/v1",
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default api;
