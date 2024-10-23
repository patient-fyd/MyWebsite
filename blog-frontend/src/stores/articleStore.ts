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
  category: {
    name: string;
  };
  author: {
    Username: string;
  };
  tags?: string[]; // 可选的 tags 字段
}

interface ArticleState {
  popularPosts: Article[];
  articles: Article[];
  articleDetail: Article | null;
  loading: boolean;
  error: string | null;
}

export const useArticleStore = defineStore("articleStore", {
  state: (): ArticleState => ({
    popularPosts: [],
    articles: [],
    articleDetail: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 获取热门文章
    async fetchPopularPosts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/api/popular-posts");
        this.popularPosts = response.data;
      } catch (error) {
        this.error = "无法获取热门文章";
        console.error("Error fetching popular posts:", error);
      } finally {
        this.loading = false;
      }
    },

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
        this.articles = response.data;
      } catch (error) {
        this.error = "获取文章失败";
        console.error("获取文章失败:", error);
      } finally {
        this.loading = false;
      }
    },

    // 获取文章详情
    async fetchPostById(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`/api/posts/${id}`);
        this.articleDetail = response.data;

        // 更新热门文章列表中的浏览量
        const postIndex = this.popularPosts.findIndex((post) => post.id === id);
        if (postIndex !== -1) {
          this.popularPosts[postIndex].views = this.articleDetail.views;
        }
      } catch (error) {
        this.error = "无法获取文章详情";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    // 发布文章
    async createArticle(
      title: string,
      content: string,
      categoryID: number,
      tags: string[],
    ) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post("/api/posts", {
          title,
          content,
          category_id: categoryID,
          tags,
        });

        if (response.status === 200) {
          this.article = response.data; // 将发布成功的文章存入 state
          alert("文章发布成功");
        }
      } catch (error: any) {
        this.error = error.response?.data?.error || "发布文章失败";
        alert(this.error);
      } finally {
        this.loading = false;
      }
    },
  },

  // 开启持久化，保存状态
  persist: {
    enabled: true,
  },
});
