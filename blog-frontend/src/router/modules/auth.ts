import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const authRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.AUTH.LOGIN,
    name: "Login",
    component: () => import("@/views/auth/LoginPage.vue"),
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: RoutePath.AUTH.REGISTER,
    name: "Register",
    component: () => import("@/views/auth/Register.vue"),
    meta: {
      requiresAuth: false,
      title: '注册'
    }
  },
  {
    path: RoutePath.AUTH.CHANGE_PASSWORD,
    name: "ChangePassword",
    component: () => import("@/views/auth/ChangePassword.vue"),
    meta: {
      requiresAuth: true,
      title: '修改密码'
    }
  },
  {
    path: RoutePath.AUTH.RESET_PASSWORD,
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPassword.vue"),
    meta: {
      requiresAuth: false,
      title: '重置密码'
    }
  }
]; 