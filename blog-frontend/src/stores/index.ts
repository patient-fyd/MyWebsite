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

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface State {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  popularPosts: Article[]; // 热门文章数据
}

export const useStore = defineStore("main", {
  // 定义 stores 的状态类型
  state: (): State => ({
    articles: [],
    categories: [],
    tags: [],
    popularPosts: [] as Article[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // 获取文章总数
    totalArticles(state): number {
      return state.articles.length;
    },

    // 获取热门文章，根据浏览量排序
    sortedPopularPosts(state): Article[] {
      return state.popularPosts.sort((a, b) => b.views - a.views);
    },
  },

  actions: {
    // 获取文章列表
    async fetchArticles() {
      try {
        const response = await axios.get("/api/posts", {
          params: {
            page: 1, // 可以在这里修改分页参数
            page_size: 6,
          },
        });
        this.articles = response.data; // 将数据存储到 stores 中
      } catch (error) {
        console.error("获取文章失败:", error);
      }
    },
    // 获取热门文章
    async fetchPopularPosts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/api/popular-posts");
        this.popularPosts = response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        this.error = "无法获取热门文章";
      } finally {
        this.loading = false;
      }
    },
  },
});
