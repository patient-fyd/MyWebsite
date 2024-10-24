import axios from "axios";
import { useUserStore } from "@/stores/userStore"; // 确保引入用户相关的 store

const baseURL =
  process.env.NODE_ENV === "http://localhost:8080"
    ? "https://ganfengyu.com"
    : "/api";

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // 将 token 添加到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器，处理 401 错误
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token"); // 获取 refresh_token
      if (!refreshToken) {
        const userStore = useUserStore();
        userStore.logout(); // 如果没有 refresh_token，则登出用户
        return Promise.reject(error);
      }

      try {
        // 尝试使用 refresh_token 刷新 access_token
        const response = await axiosInstance.post("/refresh-token", {
          refresh_token: refreshToken,
        });

        if (response.status === 200) {
          const newAccessToken = response.data.access_token;
          localStorage.setItem("token", newAccessToken);

          // 更新请求头，重新发送原始请求
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); // 重新发送原始请求
        }
      } catch (err) {
        const userStore = useUserStore();
        userStore.logout(); // 刷新令牌失败，登出用户
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
