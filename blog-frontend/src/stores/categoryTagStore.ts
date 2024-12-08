import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";
import type { Post } from "@/services/types/article";
import type { Category, Tag } from "@/services/types/base";

export const useCategoryTagStore = defineStore("categoryTag", {
  state: () => ({
    categories: [] as Category[],
    tags: [] as Tag[],
    articles: [] as Post[],
    totalArticles: 0,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<Category[]>("/categories");
        this.categories = response.data;
      } catch (err: any) {
        this.error = err.message || "获取分类列表失败";
      } finally {
        this.loading = false;
      }
    },

    async fetchArticlesByCategory(categoryId: number | string, page = 1, pageSize = 6) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get(`/posts/category/${categoryId}`, {
          params: { page, page_size: pageSize }
        });
        this.articles = response.data.posts;
        this.totalArticles = response.data.total;
      } catch (err: any) {
        this.error = err.message || "获取文章列表失败";
        this.articles = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchTags() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<Tag[]>("/tags");
        this.tags = response.data;
      } catch (err: any) {
        this.error = err.message || "获取标签列表失败";
      } finally {
        this.loading = false;
      }
    }
  }
});
