import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://api-user.fams.college/api/v1",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const storeId = sessionStorage.getItem("storeId");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  // if (storeId) {
  //   config.params = { ...config.params, storeId: storeId };
  // }
  return config;
});

export default api;
