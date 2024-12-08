import { articleApi } from '../api/articleApi'
import type { Post } from '../types/article'

export const articleService = {
  async getArticles(params: { page?: number; page_size?: number } = {}) {
    try {
      const { data } = await articleApi.getArticles(params)
      return {
        posts: data.posts || [],
        total: data.total || 0
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取文章列表失败')
    }
  },

  async getArticleById(id: number): Promise<Post> {
    try {
      const { data } = await articleApi.getArticleById(id)
      if (!data) {
        throw new Error('文章不存在')
      }
      return data
    } catch (error: any) {
      console.error('获取文章详情失败:', error)
      throw new Error(error.response?.data?.message || '无法获取文章详情')
    }
  },

  async getPopularPosts(): Promise<Post[]> {
    try {
      const { data } = await articleApi.getPopularPosts()
      return data.posts || []
    } catch (error: any) {
      console.error('获取热门文章失败:', error)
      throw new Error(error.response?.data?.message || '无法获取热门文章')
    }
  },

  async deleteArticle(id: number): Promise<boolean> {
    try {
      await articleApi.deleteArticle(id)
      return true
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '删除文章失败')
    }
  }
} 