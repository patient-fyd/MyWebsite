import { defineStore } from "pinia";
import { ref } from "vue";
import axiosInstance from "@/utils/axiosInstance";

// 定义接口类型
interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  views: number;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  author: {
    Username: string;
  };
  tags?: string[]; // 可选的 tags 字段
}

export const useArticleStore = defineStore(
  "articleStore",
  () => {
    // 状态定义
    const popularPosts = ref<Article[]>([]);
    const articles = ref<Article[]>([]);
    const articleDetail = ref<Article | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const searchResults = ref<Article[]>([]);
    const searchLoading = ref(false);
    const searchError = ref<string | null>(null);
    const totalArticles = ref(0);
    const totalSearchResults = ref(0);

    // 获取热门文章
    const fetchPopularPosts = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await axiosInstance.get("/popular-posts");
        popularPosts.value = response.data;
      } catch (err) {
        error.value = "无法获取热门文章";
        console.error("Error fetching popular posts:", err);
      } finally {
        loading.value = false;
      }
    };

    // 获取文章列表
    const fetchArticles = async (
      params: { page?: number; page_size?: number } = {},
    ) => {
      loading.value = true;
      error.value = null;
      try {
        const response = await axiosInstance.get("/posts", { params });
        articles.value = response.data.posts;
        totalArticles.value = response.data.total;
      } catch (err: any) {
        error.value = "无法获取文章列表";
        console.error("Error fetching articles:", err);
      } finally {
        loading.value = false;
      }
    };

    // 获取文章详情
    const fetchPostById = async (id: number) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axiosInstance.get(`/posts/${id}`);
        articleDetail.value = response.data;

        // 更新热门文章列表中的浏览量
        const postIndex = popularPosts.value.findIndex(
          (post) => post.id === id,
        );
        if (postIndex !== -1) {
          popularPosts.value[postIndex].views = articleDetail.value.views;
        }
      } catch (err) {
        error.value = "无法获取文章详情";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    // 发布文章
    const createArticle = async (
      title: string,
      content: string,
      summary: string,
      categoryID: number,
      tags: string[],
    ) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axiosInstance.post("/posts", {
          title,
          content,
          summary,
          category_id: categoryID,
          tags,
        });

        if (response.status === 200) {
          articleDetail.value = response.data;
          alert("文章发布成功");
        }
      } catch (err: any) {
        error.value = err.response?.data?.error || "发布文章失败";
        alert(error.value); // 显示错误信息
      } finally {
        loading.value = false;
      }
    };

    // 删除文章
    const deletePostById = async (id: number) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axiosInstance.delete(`/posts/${id}`);
        if (response.status === 200) {
          alert("文章删除成功");
          // 从 articles 和 popularPosts 中移除已删除的文章
          articles.value = articles.value.filter((post) => post.id !== id);
          popularPosts.value = popularPosts.value.filter(
            (post) => post.id !== id,
          );
        }
      } catch (err: any) {
        error.value = err.response?.data?.error || "删除文章失败";
        alert(error.value);
      } finally {
        loading.value = false;
      }
    };

    // 修改文章
    const updatePostById = async (
      id: number,
      title: string,
      content: string,
      summary: string,
      categoryID: number,
      tags: string[],
    ) => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axiosInstance.put(`/posts/${id}`, {
          title,
          content,
          summary,
          category_id: categoryID,
          tags,
        });

        if (response.status === 200) {
          articleDetail.value = response.data;
          alert("文章更新成功");
          // 更新 articles 和 popularPosts 中的文章信息
          const updateArticleInList = (list: Article[]) => {
            const index = list.findIndex((post) => post.id === id);
            if (index !== -1) {
              list[index] = { ...list[index], ...response.data };
            }
          };
          updateArticleInList(articles.value);
          updateArticleInList(popularPosts.value);
        }
      } catch (err: any) {
        error.value = err.response?.data?.error || "更新文章失败";
        alert(error.value);
      } finally {
        loading.value = false;
      }
    };

    const searchArticles = async (keyword: string, page = 1, pageSize = 10) => {
      searchLoading.value = true;
      searchError.value = null;

      try {
        const response = await axiosInstance.get("/search", {
          params: {
            keyword,
            page,
            page_size: pageSize,
          },
        });
        searchResults.value = response.data.posts;
        totalSearchResults.value = response.data.total; // 保存总结果数
      } catch (err: any) {
        searchError.value = err.response?.data?.error || "搜索文章失败";
        console.error("Error searching articles:", err);
      } finally {
        searchLoading.value = false;
      }
    };

    return {
      // 状态
      popularPosts,
      articles,
      articleDetail,
      loading,
      error,
      searchResults,
      searchLoading,
      searchError,
      totalArticles,
      totalSearchResults,
      // 方法
      fetchPopularPosts,
      fetchArticles,
      fetchPostById,
      createArticle,
      deletePostById,
      updatePostById,
      searchArticles,
    };
  },
  {
    persist: {
      enabled: true,
    },
    // 持久化配置
  },
);
