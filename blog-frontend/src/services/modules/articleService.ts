import { articleApi } from '../api/articleApi'

export const articleService = {
  async getPopularPosts() {
    try {
      const { data } = await articleApi.getPopularPosts()
      return data
    } catch (error) {
      console.error('获取热门文章失败:', error)
      throw new Error('无法获取热门文章')
    }
  },

  async getArticles(params: { page?: number; page_size?: number } = {}) {
    try {
      const { data } = await articleApi.getArticles(params)
      return data
    } catch (error) {
      console.error('获取文章列表失败:', error)
      throw new Error('无法获取文章列表')
    }
  },

  async getArticleById(id: number) {
    try {
      const { data } = await articleApi.getArticleById(id)
      return data
    } catch (error) {
      console.error('获取文章详情失败:', error)
      throw new Error('无法获取文章详情')
    }
  },

  async createArticle(articleData: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    try {
      const { data } = await articleApi.createArticle(articleData)
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '发布文章失败'
      throw new Error(errorMessage)
    }
  },

  async updateArticle(id: number, articleData: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    try {
      const { data } = await articleApi.updateArticle(id, articleData)
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '更新文章失败'
      throw new Error(errorMessage)
    }
  },

  async deleteArticle(id: number) {
    try {
      await articleApi.deleteArticle(id)
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '删除文章失败'
      throw new Error(errorMessage)
    }
  },

  async searchArticles(keyword: string, page = 1, pageSize = 10) {
    try {
      const { data } = await articleApi.searchArticles({
        keyword,
        page,
        page_size: pageSize
      })
      return data
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || '搜索文章失败'
      throw new Error(errorMessage)
    }
  }
} 