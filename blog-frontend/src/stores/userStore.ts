import { defineStore } from "pinia";
import axios from "axios";

// 定义用户接口类型
interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
}

interface UserState {
  user: User | null; // 当前用户信息
  isAuthenticated: boolean; // 用户是否登录
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
  successMessage: string | null; // 成功信息
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
  }),

  actions: {
    // 用户注册
    async register(username: string, password: string, email: string) {
      console.log("发送注册请求", { username, email });
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post("/api/register", {
          username,
          password,
          email,
        });
        console.log("注册响应", response);

        if (response.status === 200) {
          this.user = response.data.user;
          this.isAuthenticated = true;
        }
      } catch (error: any) {
        console.error("注册错误捕获", error);
        this.error = error.response?.data?.error || "注册失败";
      } finally {
        this.loading = false;
      }
    },

    // 用户登录
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post("/api/login", {
          username,
          password,
        });

        if (response.status === 200) {
          this.user = response.data.user;
          this.isAuthenticated = true;

          // 保存 access_token 到 localStorage
          const accessToken = response.data.access_token;
          localStorage.setItem("token", accessToken); // 保存 token

          // 保存 refresh_token
          const refreshToken = response.data.refresh_token;
          localStorage.setItem("refresh_token", refreshToken);
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || "登录失败";
      } finally {
        this.loading = false;
      }
    },

    // 用户登出
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token"); // 清除 access_token
      localStorage.removeItem("refresh_token"); // 清除 refresh_token
      alert("已退出登录");
    },

    // 自动登录
    async checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("/api/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            this.user = response.data.user;
            this.isAuthenticated = true;
          }
        } catch (error: any) {
          this.logout(); // 如果 token 无效，登出
        }
      }
    },

    // 修改密码
    async changePassword(oldPassword: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      try {
        // 从 localStorage 获取 token
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "未提供认证令牌，请重新登录";
          return;
        }

        // 发起请求，带上 Authorization 头部
        const response = await axios.post(
          "/api/change-password",
          {
            old_password: oldPassword,
            new_password: newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 设置 Authorization 头部
            },
          },
        );

        if (response.status === 200) {
          this.successMessage = "密码修改成功";
        }
      } catch (err: any) {
        this.error = err.response?.data?.error || "修改密码失败";
      } finally {
        this.loading = false;
      }
    },
  },

  persist: {
    enabled: true, // 使用持久化保存用户状态
  },
});
