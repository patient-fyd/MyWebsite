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
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
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
          localStorage.setItem("token", response.data.token); // 保存 token
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
      localStorage.removeItem("token"); // 清除 token
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
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: any) {
          this.logout(); // 如果 token 无效，登出
        }
      }
    },
  },

  persist: {
    enabled: true, // 使用持久化保存用户状态
  },
});
