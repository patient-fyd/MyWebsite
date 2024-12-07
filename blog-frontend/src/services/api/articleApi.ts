import http from '../http'
import type { Article } from '../types/article'

export const articleApi = {
  // 获取热门文章
  getPopularPosts() {
    return http.get<Article[]>('/popular-posts')
  },

  // 获取文章列表
  getArticles(params: { page?: number; page_size?: number }) {
    return http.get<{ posts: Article[]; total: number }>('/posts', { params })
  },

  // 获取文章详情
  getArticleById(id: number) {
    return http.get<Article>(`/posts/${id}`)
  },

  // 创建文章
  createArticle(data: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    return http.post<Article>('/posts', data)
  },

  // 更新文章
  updateArticle(id: number, data: {
    title: string
    content: string
    summary: string
    category_id: number
    tags: string[]
  }) {
    return http.put<Article>(`/posts/${id}`, data)
  },

  // 删除文章
  deleteArticle(id: number) {
    return http.delete(`/posts/${id}`)
  },

  // 搜索文章
  searchArticles(params: { keyword: string; page: number; page_size: number }) {
    return http.get<{ posts: Article[]; total: number }>('/search', { params })
  }
} 