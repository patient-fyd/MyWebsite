import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { userService } from "@/services/modules/userService";

export const useUserStore = defineStore("user", () => {
  const token = ref(localStorage.getItem("token") || "");
  const user = ref<any>(null);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = async (username: string, password: string) => {
    try {
      const response = await userService.login(username, password);
      token.value = response.token;
      localStorage.setItem("token", response.token);
      
      // 登录成功后获取用户信息
      const userData = await getUserInfo();
      if (userData) {
        user.value = userData;
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message;
      return false;
    }
  };

  const getUserInfo = async () => {
    if (!token.value) return null;
    try {
      const userData = await userService.getUserInfo();
      user.value = userData;
      return userData;
    } catch (err: any) {
      error.value = err.message;
      logout();
      return null;
    }
  };

  const logout = () => {
    token.value = "";
    user.value = null;
    localStorage.removeItem("token");
  };

  // 初始化时获取用户信息
  if (token.value) {
    getUserInfo();
  }

  return {
    token,
    user,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getUserInfo
  };
}, {
  persist: true
});
