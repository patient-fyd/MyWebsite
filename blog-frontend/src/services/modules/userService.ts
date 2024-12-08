import { userApi } from "../api/userApi";
import type { User } from "@/services/types/user.d.ts";
import axiosInstance from '@/utils/axiosInstance'

interface LoginResponse {
  code?: number;
  message: string;
  access_token: string;
  refresh_token: string;
}

export const userService = {
  async register(username: string, password: string, email: string) {
    try {
      const { data } = await userApi.register({ username, password, email });
      if (data.error) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "注册失败，该用户名可能已被使用";
      throw new Error(errorMessage);
    }
  },

  async login(username: string, password: string) {
    try {
      const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { 
        username, 
        password 
      });
      console.log('Login response:', data);
      
      if (data.access_token) {
        return {
          token: data.access_token,
          user: null  // 用户信息需要通过单独的请求获取
        };
      }
      
      throw new Error(data.message || '登录失败');
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || '登录失败');
    }
  },

  async getUserInfo(): Promise<User> {
    try {
      const { data } = await axiosInstance.get('/user');
      console.log('GetUserInfo response:', data);
      
      if (!data.data) {
        throw new Error('获取用户信息失败');
      }
      
      return data.data;
    } catch (error: any) {
      console.error('GetUserInfo error:', error);
      throw new Error(error.response?.data?.message || '获取用户信息失败');
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