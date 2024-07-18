import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import useStore from "../store";

const apiShipper: AxiosInstance = axios.create({
  baseURL: "https://api-shipper.fams.college/api/v1",
});

apiShipper.interceptors.request.use((config: AxiosRequestConfig) => {
  const { accessToken } = useStore.getState();
  if (accessToken && !config.url?.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default apiShipper;