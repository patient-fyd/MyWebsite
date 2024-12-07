import axiosInstance from "@/utils/axiosInstance";
import type { User, LoginResponse, ApiResponse } from "@/services/types/user.d.ts";

export const userApi = {
  register(data: { username: string; password: string; email: string }) {
    return axiosInstance.post<ApiResponse<User>>("/register", data);
  },

  login(data: { username: string; password: string }) {
    return axiosInstance.post<ApiResponse<LoginResponse>>("/login", data);
  },

  getUserInfo() {
    return axiosInstance.get<ApiResponse<User>>("/user");
  },

  changePassword(data: { old_password: string; new_password: string }) {
    return axiosInstance.post<ApiResponse>("/change-password", data);
  },

  requestPasswordReset(data: { email: string }) {
    return axiosInstance.post<ApiResponse>("/request-password-reset", data);
  },

  resetPassword(data: { verification_code: string; new_password: string }) {
    return axiosInstance.post<ApiResponse>("/reset-password", data);
  }
}; 