import { userApi } from "../api/userApi";
import type { User, LoginResponse } from "@/services/types/user.d.ts";
import { TokenService } from "@/services/auth/tokenService";

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

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await userApi.login({ username, password });
      console.log('API response:', response);
      
      const loginData = response.data;
      if (!loginData.access_token || !loginData.refresh_token) {
        console.error('Invalid login response:', loginData);
        throw new Error("登录响应缺少必要的认证信息");
      }

      TokenService.setToken(loginData.access_token);
      TokenService.setRefreshToken(loginData.refresh_token);
      
      return loginData;
    } catch (error: any) {
      console.error('Login error details:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "登录失败";
      throw new Error(errorMessage);
    }
  },

  async getUserInfo(): Promise<User> {
    try {
      const { data } = await userApi.getUserInfo();
      console.log('GetUserInfo response:', data);
      
      if (!data.data) {
        console.error('Invalid user data format:', data);
        throw new Error("返回的用户数据格式不正确");
      }

      const userData = data.data;
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at
      };
    } catch (error: any) {
      console.error('获取用户信息错误:', error.response || error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "获取用户信息失败";
      throw new Error(errorMessage);
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