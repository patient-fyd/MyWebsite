import { defineStore } from "pinia";
import { ref } from "vue";
import { articleService } from "@/services/modules/articleService";
import type { Post } from "@/services/types/article";

export const useArticleStore = defineStore(
  "articleStore",
  () => {
    // 状态定义
    const articles = ref<Post[]>([]);
    const popularPosts = ref<Post[]>([]);
    const totalArticles = ref(0);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 获取文章列表
    const fetchArticles = async (params: { page?: number; page_size?: number } = {}) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await articleService.getArticles(params);
        articles.value = response.posts;
        totalArticles.value = response.total;
      } catch (err: any) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    // 获取热门文章
    const getPopularPosts = async () => {
      loading.value = true;
      error.value = null;
      try {
        const posts = await articleService.getPopularPosts();
        popularPosts.value = posts;
        return posts;
      } catch (err: any) {
        error.value = err.message;
        console.error('获取热门文章失败:', err);
        return [];
      } finally {
        loading.value = false;
      }
    };

    // 获取文章详情
    const getArticleById = async (id: number): Promise<Post | null> => {
      loading.value = true;
      error.value = null;
      try {
        const post = await articleService.getArticleById(id);
        return post;
      } catch (err: any) {
        error.value = err.message;
        return null;
      } finally {
        loading.value = false;
      }
    };

    // 删除文章
    const deleteArticle = async (id: number): Promise<boolean> => {
      loading.value = true;
      error.value = null;
      try {
        await articleService.deleteArticle(id);
        articles.value = articles.value.filter(article => article.id !== id);
        return true;
      } catch (err: any) {
        error.value = err.message;
        return false;
      } finally {
        loading.value = false;
      }
    };

    return {
      // 状态
      articles,
      popularPosts,
      totalArticles,
      loading,
      error,
      // 方法
      fetchArticles,
      getPopularPosts,
      getArticleById,
      deleteArticle
    };
  },
  {
    persist: true
  }
);
