import { defineStore } from "pinia";
import axiosInstance from "@/utils/axiosInstance";

export const useCategoryTagStore = defineStore("categoryTag", {
  state: () => ({
    categories: [] as { id: number; name: string }[],
    tags: [] as { id: number; name: string }[],
    articles: [] as any[],
    totalArticles: 0,
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

    async fetchArticlesByCategory(
      categoryId: number | string,
      page = 1,
      pageSize = 6,
    ) {
      try {
        const response = await axiosInstance.get(
          `/posts/category/${categoryId}`,
          {
            params: {
              page,
              page_size: pageSize,
            },
          },
        );
        this.articles = response.data.posts;
        this.totalArticles = response.data.total; // 保存总文章数
        this.error = null; // 重置错误信息
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          // 如果是 404 错误，表示该类别下没有文章
          this.articles = []; // 清空文章列表
          this.error = "该类别下没有文章";
        } else {
          console.error("获取文章列表失败", error);
          this.error = "获取文章列表失败";
        }
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
