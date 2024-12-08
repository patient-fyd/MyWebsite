import type { RouteRecordRaw } from "vue-router";
import { RoutePath } from "../constants";

export const readingNotesRoutes: RouteRecordRaw = {
  path: RoutePath.READING_NOTES.ROOT,
  name: "ReadingNotes",
  component: () => import("@/views/ReadingNotes.vue"),
  meta: {
    requiresAuth: false,
    title: '读书笔记'
  },
  children: [
    {
      path: "",
      name: "ReadingNotesDefault",
      component: () => import("@/views/reading/Home.vue")
    },
    {
      path: "home",
      name: "ReadingNotesHome",
      component: () => import("@/views/reading/Home.vue")
    },
    {
      path: "books",
      name: "ReadingNotesBooks",
      component: () => import("@/views/reading/Books.vue")
    },
    {
      path: "books/:id",
      name: "ReadingNotesBookDetails",
      component: () => import("@/views/reading/BookDetails.vue"),
      props: true
    },
    {
      path: "note-editor",
      name: "ReadingNotesNoteEditor",
      component: () => import("@/views/reading/NoteEditor.vue")
    },
    {
      path: "thoughts",
      name: "ReadingNotesThoughts",
      component: () => import("@/views/reading/Thoughts.vue")
    },
    {
      path: "purchase-list",
      name: "ReadingNotesPurchaseList",
      component: () => import("@/views/reading/PurchaseList.vue")
    },
    {
      path: "reading-plan",
      name: "ReadingNotesReadingPlan",
      component: () => import("@/views/reading/ReadingPlan.vue")
    },
    {
      path: "share",
      name: "ReadingNotesShare",
      component: () => import("@/views/reading/Share.vue")
    }
  ]
}; 