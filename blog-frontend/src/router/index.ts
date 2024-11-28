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
    path: "/learning-route",
    name: "LearningRoute",
    component: () => import("@/views/GoLearningRoute.vue"),
  },
  {
    path: "/posts/:id",
    name: "PostDetail",
    component: () => import("@/views/PostDetail.vue"),
    props: true, // 确保传递 props
  },
  {
    path: "/posts/:id/edit",
    name: "EditArticle",
    component: () => import("@/views/EditArticle.vue"),
    props: true,
  },
  {
    path: "/change-password",
    name: "ChangePassword",
    component: () => import("@/views/ChangePassword.vue"),
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/ResetPassword.vue"),
  },
  {
    path: "/posts/create",
    name: "CreateArticle",
    component: () => import("@/views/CreateArticle.vue"),
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
    component: () => import("@/views/StudyTask.vue"),
  },
  {
    path: "/readingnotes",
    name: "ReadingNotes",
    component: () => import("@/views/ReadingNotes.vue"),
    children: [
      {
        path: "", // 默认子路由，显示首页内容
        name: "ReadingNotesDefault",
        component: () => import("@/views/readingnotes/Home.vue"),
      },
      {
        path: "home",
        name: "ReadingNotesHome",
        component: () => import("@/views/readingnotes/Home.vue"),
      },
      {
        path: "books",
        name: "ReadingNotesBooks",
        component: () => import("@/views/readingnotes/Books.vue"),
      },
      {
        path: "books/:id",
        name: "ReadingNotesBookDetails",
        component: () => import("@/views/readingnotes/BookDetails.vue"),
        props: true,
      },
      {
        path: "note-editor",
        name: "ReadingNotesNoteEditor",
        component: () => import("@/views/readingnotes/NoteEditor.vue"),
      },
      {
        path: "thoughts",
        name: "ReadingNotesThoughts",
        component: () => import("@/views/readingnotes/Thoughts.vue"),
      },
      {
        path: "purchase-list",
        name: "ReadingNotesPurchaseList",
        component: () => import("@/views/readingnotes/PurchaseList.vue"),
      },
      {
        path: "reading-plan",
        name: "ReadingNotesReadingPlan",
        component: () => import("@/views/readingnotes/ReadingPlan.vue"),
      },
      {
        path: "share",
        name: "ReadingNotesShare",
        component: () => import("@/views/readingnotes/Share.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
