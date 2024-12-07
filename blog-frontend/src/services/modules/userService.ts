import { userApi } from "../api/userApi";
import type { User } from "@/services/types/user.d.ts";

export const userService = {
  async register(username: string, password: string, email: string) {
    try {
      const { data } = await userApi.register({ username, password, email });
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "注册失败");
    }
  },

  async login(username: string, password: string) {
    try {
      const { data } = await userApi.login({ username, password });
      const { access_token, refresh_token } = data.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      return data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "登录失败");
    }
  },

  async getUserInfo(): Promise<User> {
    try {
      const { data } = await userApi.getUserInfo();
      return {
        id: data.data.id,
        username: data.data.username,
        email: data.data.email,
        role: data.data.role,
        createdAt: data.data.createdAt,
        updatedAt: data.data.updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "获取用户信息失败");
    }
  },

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const { data } = await userApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "修改密码失败");
    }
  },

  async requestPasswordReset(email: string) {
    try {
      const { data } = await userApi.requestPasswordReset({ email });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "请求重置密码失败");
    }
  },

  async resetPassword(verificationCode: string, newPassword: string) {
    try {
      const { data } = await userApi.resetPassword({
        verification_code: verificationCode,
        new_password: newPassword
      });
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "重置密码失败");
    }
  }
}; 