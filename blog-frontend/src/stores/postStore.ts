import { defineStore } from "pinia";
import axios from "axios";

// 定义接口类型
interface Article {
  id: number;
  title: string;
  content: string;
  views: number;
  created_at: string;
  updated_at: string;
  // 你可以选择展示 category 和 author 的一些字段
  category: {
    name: string;
  };
  author: {
    Username: string;
  };
}

interface State {
  popularPosts: Article[];
  loading: boolean;
  error: string | null;
}

export const usePostStore = defineStore("postStore", {
  state: (): State => ({
    popularPosts: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchPopularPosts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get("/api/popular-posts");
        // 解析返回的文章数据，直接将其赋值给 popularPosts
        this.popularPosts = response.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          views: post.views,
          created_at: post.created_at,
          updated_at: post.updated_at,
          category: {
            name: post.category.name, // 只提取类别名称
          },
          author: {
            Username: post.author.Username, // 只提取作者用户名
          },
        }));
      } catch (error) {
        this.error = "无法获取热门文章";
      } finally {
        this.loading = false;
      }
    },
  },
});
