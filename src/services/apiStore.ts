import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import useStore from "../store";

const apiStore: AxiosInstance = axios.create({
  baseURL: "https://api-user.fams.college/api/v1",
});

apiStore.interceptors.request.use((config: AxiosRequestConfig) => {
  const { accessToken } = useStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default apiStore;