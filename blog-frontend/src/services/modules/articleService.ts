import { articleApi } from '../api/articleApi'
import type { Post } from '../types/article'

export const articleService = {
  async getArticles(params: { page?: number; page_size?: number } = {}) {
    try {
      const { data } = await articleApi.getArticles(params)
      const posts = data.data.posts.map(post => ({
        ...post,
        comments: [],
        comment_count: post.comment_count || 0
      }))
      return {
        posts,
        total: data.data.total || 0
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '获取文章列表失败')
    }
  },

  async getArticleById(id: number): Promise<Post> {
    try {
      const { data } = await articleApi.getArticleById(id)
      if (!data || !data.data) {
        throw new Error('文章不存在')
      }
      return {
        ...data.data,
        comments: data.data.comments || [],
        comment_count: data.data.comment_count || 0
      }
    } catch (error: any) {
      console.error('获取文章详情失败:', error)
      throw new Error(error.response?.data?.message || '无法获取文章详情')
    }
  },

  async getPopularPosts(): Promise<Post[]> {
    try {
      const { data } = await articleApi.getPopularPosts()
      console.log('Popular posts response:', data)
      if (Array.isArray(data)) {
        return data
      }
      return data.data.posts || []
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