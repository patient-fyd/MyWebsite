import { defineStore } from "pinia";
import axios from "axios";

// 定义接口类型
interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
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
  // 定义 store 的状态类型
  state: (): State => ({
    articles: [],
    categories: [],
    tags: [],
    popularPosts: [],
  }),

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
        this.articles = response.data; // 将数据存储到 store 中
      } catch (error) {
        console.error("获取文章失败:", error);
      }
    },
  },
});
