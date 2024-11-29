import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";

// 定义用户接口类型
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null; // 当前用户信息
  isAdmin: boolean; // 用户是否为管理员
  isAuthenticated: boolean; // 用户是否登录
  loading: boolean; // 加载状态
  error: string | null; // 错误信息
  successMessage: string | null; // 成功信息
}

export const useUserStore = defineStore("userStore", {
  state: (): UserState => ({
    user: null,
    isAdmin: false,
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
        const response = await axiosInstance.post("/register", {
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

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const response = await axiosInstance.get("/user");

        // 调试输出
        console.log("完整的用户响应:", response);
        console.log("响应数据:", response.data);

        // 将响应中的数据保存到 store
        const userData = response.data;
        console.log("用户信息（分解的）:", userData);

        // 确保 response.data 中的属性是否符合预期
        this.user = {
          id: userData.id,
          username: userData.Username, // API 返回的字段名
          email: userData.Email, // API 返回的字段名
          role: userData.Role, // API 返回的字段名
          createdAt: userData.CreatedAt,
          updatedAt: userData.UpdatedAt,
        };

        console.log("赋值后的用户信息:", this.user);

        if (userData.Role === "admin") {
          console.log("用户是管理员");
          this.isAdmin = true;
        } else {
          console.log("用户不是管理员");
          this.isAdmin = false;
        }
      } catch (error) {
        console.error("获取用户信息失败", error);
        throw new Error("无法获取用户信息");
      }
    },

    // 用户登录
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post("/login", {
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

          await this.fetchUserInfo();
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
        const response = await axiosInstance.post(
          "/change-password",
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

    // 请求重置密码邮件
    async requestPasswordReset(email: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post("/request-password-reset", {
          email,
        });
        this.successMessage = response.data.message;
      } catch (error: any) {
        this.error = error.response?.data?.error || "请求失败";
      } finally {
        this.loading = false;
      }
    },

    // 重置密码
    async resetPassword(verificationCode: string, newPassword: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post("/reset-password", {
          verification_code: verificationCode,
          new_password: newPassword,
        });
        this.successMessage = response.data.message;
      } catch (error: any) {
        this.error = error.response?.data?.error || "重置密码失败";
      } finally {
        this.loading = false;
      }
    },
  },

  persist: {
    storage: localStorage,
  },
});
