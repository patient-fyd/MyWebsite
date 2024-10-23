import axios from "axios";
import { useUserStore } from "@/stores/userStore";

// 创建 axios 实例
export function useAxios() {
  const userStore = useUserStore();

  const axiosInstance = axios.create({
    baseURL: "/api", // 假设你的后端 API 前缀是 /api
    timeout: 5000,
  });

  // 请求拦截器，自动在请求头中添加 access_token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 响应拦截器，处理 401 错误并尝试刷新令牌
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 如果出现 401 错误，并且请求没有尝试过刷新令牌
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // 标记为已经尝试过刷新

        // 获取 refresh_token
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          userStore.logout(); // 如果没有 refresh_token，则退出登录
          return Promise.reject(error);
        }

        try {
          // 调用刷新令牌接口
          const response = await axiosInstance.post("/refresh-token", {
            refresh_token: refreshToken,
          });

          if (response.status === 200) {
            // 成功获取新的 access_token，更新本地存储
            const newAccessToken = response.data.access_token;
            localStorage.setItem("token", newAccessToken);

            // 更新请求头并重新发送原始请求
            originalRequest.headers["Authorization"] =
              `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // 重新发送请求
          }
        } catch (err) {
          userStore.logout(); // 刷新失败则退出登录
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    },
  );

  return {
    axios: axiosInstance,
  };
}
