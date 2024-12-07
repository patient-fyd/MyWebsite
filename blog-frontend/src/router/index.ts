import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/article/List.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 捕获所有未定义的路由
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"), // 定义你的404页面组件
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue"),
  },
  {
    path: "/learning-route",
    name: "LearningRoute",
    component: () => import("@/views/GoLearningRoute.vue"),
  },
  {
    path: "/posts/:id",
    name: "PostDetail",
    component: () => import("@/views/article/Detail.vue"),
    props: true, // 确保传递 props
  },
  {
    path: "/posts/:id/edit",
    name: "EditArticle",
    component: () => import("@/views/article/Edit.vue"),
    props: true,
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: () => import("@/views/auth/ChangePassword.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPassword.vue"),
  },
  {
    path: "/posts/create",
    name: "CreateArticle",
    component: () => import("@/views/article/Create.vue"),
  },
  {
    path: "/category/:categoryId",
    name: "CategoryList",
    component: () => import("@/views/CategoryPosts.vue"),
    props: true,
  },
  {
    path: "/search",
    name: "SearchResults",
    component: () => import("@/views/SearchResults.vue"),
  },
  {
    path: "/study-task",
    name: "StudyTask",
    component: () => import("@/views/study/StudyTask.vue"),
  },
  {
    path: "/reading",
    name: "ReadingNotes",
    component: () => import("@/views/ReadingNotes.vue"),
    children: [
      {
        path: "", // 默认子路由，显示首页内容
        name: "ReadingNotesDefault",
        component: () => import("@/views/reading/Home.vue"),
      },
      {
        path: "home",
        name: "ReadingNotesHome",
        component: () => import("@/views/reading/Home.vue"),
      },
      {
        path: "books",
        name: "ReadingNotesBooks",
        component: () => import("@/views/reading/Books.vue"),
      },
      {
        path: "books/:id",
        name: "ReadingNotesBookDetails",
        component: () => import("@/views/reading/BookDetails.vue"),
        props: true,
      },
      {
        path: "note-editor",
        name: "ReadingNotesNoteEditor",
        component: () => import("@/views/reading/NoteEditor.vue"),
      },
      {
        path: "thoughts",
        name: "ReadingNotesThoughts",
        component: () => import("@/views/reading/Thoughts.vue"),
      },
      {
        path: "purchase-list",
        name: "ReadingNotesPurchaseList",
        component: () => import("@/views/reading/PurchaseList.vue"),
      },
      {
        path: "reading-plan",
        name: "ReadingNotesReadingPlan",
        component: () => import("@/views/reading/ReadingPlan.vue"),
      },
      {
        path: "share",
        name: "ReadingNotesShare",
        component: () => import("@/views/reading/Share.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
