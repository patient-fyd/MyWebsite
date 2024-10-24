import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";

export const useCategoryTagStore = defineStore("categoryTag", {
  state: () => ({
    categories: [] as { id: number; name: string }[],
    tags: [] as { id: number; name: string }[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get("/categories"); // 确保这个 URL 是正确的
        this.categories = response.data;
      } catch (err) {
        this.error = "获取分类列表失败";
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get("/tags"); // 确保这个 URL 是正确的
        this.tags = response.data;
      } catch (err) {
        this.error = "获取标签列表失败";
      } finally {
        this.loading = false;
      }
    },
  },
});
