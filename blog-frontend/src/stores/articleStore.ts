import { defineStore } from "pinia";
import axios from "axios";

// 定义接口类型
interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
}

interface ArticleState {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

export const useArticleStore = defineStore("articleStore", {
  // 定义文章 Store 的状态
  state: (): ArticleState => ({
    articles: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 获取文章列表
    async fetchArticles(page = 1, pageSize = 6) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/api/posts", {
          params: {
            page,
            page_size: pageSize,
          },
        });
        this.articles = response.data; // 将数据存储到 store 中
      } catch (error) {
        this.error = "获取文章失败";
        console.error("获取文章失败:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
