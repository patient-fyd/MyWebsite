import axiosInstance from '@/utils/axiosInstance'
import type { ArticleListResponse, ArticleResponse } from '../types/article'

export const articleApi = {
  // 获取热门文章
  getPopularPosts() {
    console.log('Calling getPopularPosts API')
    return axiosInstance.get<ArticleListResponse>('/popular-posts')
  },

  // 获取文章列表
  getArticles(params: { page?: number; page_size?: number }) {
    console.log('Calling getArticles API with params:', params)
    return axiosInstance.get<ArticleListResponse>('/posts', { 
      params,
      // 添加错误处理
      validateStatus: (status) => {
        return status >= 200 && status < 300
      }
    })
  },

  // 获取文章详情
  getArticleById(id: number) {
    console.log('Calling getArticleById API with id:', id)
    return axiosInstance.get<ArticleResponse>(`/posts/${id}`)
  },

  // 创建文章
  createArticle(data: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    return axiosInstance.post<ArticleResponse>('/posts', data)
  },

  // 更新文章
  updateArticle(id: number, data: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    return axiosInstance.put<ArticleResponse>(`/posts/${id}`, data)
  },

  // 删除文章
  deleteArticle(id: number) {
    return axiosInstance.delete<ArticleResponse>(`/posts/${id}`)
  },

  // 搜索文章
  searchArticles(params: { keyword: string; page: number; page_size: number }) {
    return axiosInstance.get<ArticleListResponse>('/search', { params })
  }
} 