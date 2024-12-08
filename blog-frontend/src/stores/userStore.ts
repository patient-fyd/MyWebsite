import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userService } from "@/services/modules/userService";
import type { User } from "@/services/types/user";

export const useUserStore = defineStore("userStore", () => {
  // 状态
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);

  // 计算属性
  const isAdmin = computed(() => user.value?.role === "admin");
  const isAuthenticated = computed(() => !!user.value);

  // 工具函数
  const setError = (message: string) => {
    error.value = message;
    successMessage.value = null;
  };

  const setSuccess = (message: string) => {
    successMessage.value = message;
    error.value = null;
  };

  // Actions
  const register = async (username: string, password: string, email: string) => {
    loading.value = true;
    error.value = null;

    try {
      const userData = await userService.register(username, password, email);
      if (userData) {
        user.value = userData;
        setSuccess("注册成功");
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (username: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.login(username, password);
      
      // 登录成功后立即获取用户信息
      await fetchUserInfo();
      
      setSuccess(response.message || "登录成功");
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userData = await userService.getUserInfo();
      user.value = userData; // 确保这里正确设置了用户数据
      return userData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setSuccess("已退出登录");
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    loading.value = true;
    error.value = null;

    try {
      await userService.changePassword(oldPassword, newPassword);
      setSuccess("密码修改成功");
    } catch (err: any) {
      setError(err.message);
    } finally {
      loading.value = false;
    }
  };

  const requestPasswordReset = async (email: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.requestPasswordReset(email);
      setSuccess(response.message || "重置密码请求已发送");
    } catch (err: any) {
      setError(err.message);
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (verificationCode: string, newPassword: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.resetPassword(verificationCode, newPassword);
      setSuccess(response.message || "密码重置成功");
    } catch (err: any) {
      setError(err.message);
    } finally {
      loading.value = false;
    }
  };

  return {
    // 状态
    user,
    loading,
    error,
    successMessage,
    // 计算属性
    isAdmin,
    isAuthenticated,
    // Actions
    register,
    login,
    logout,
    fetchUserInfo,
    changePassword,
    requestPasswordReset,
    resetPassword,
  };
}, {
  persist: true
});
