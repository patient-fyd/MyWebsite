import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const studyRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.STUDY.TASK,
    name: "StudyTask",
    component: () => import("@/views/study/StudyTask.vue"),
    meta: {
      requiresAuth: false,
      title: '学习任务'
    }
  },
  {
    path: RoutePath.STUDY.LEARNING_ROUTE,
    name: "LearningRoute",
    component: () => import("@/views/GoLearningRoute.vue"),
    meta: {
      requiresAuth: false,
      title: '学习路线'
    }
  }
]; 