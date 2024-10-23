import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 捕获所有未定义的路由
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"), // 定义你的404页面组件
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
  {
    path: "/learningRoute",
    name: "LearningRoute",
    component: () => import("@/views/GoLearningRoute.vue"),
  },
  {
    path: "/posts/:id",
    name: "PostDetail",
    component: () => import("@/views/PostDetail.vue"),
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: () => import("@/views/ChangePassword.vue"),
  },
  {
    path: "/posts",
    name: "CreateArticle",
    component: () => import("@/views/CreateArticle.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
