import axiosInstance from '@/utils/axiosInstance'
import type { 
  CreateCommentData, 
  CommentListResponse,
  CommentResponse,
  CommentActionResponse 
} from '../types/comment'

export const commentApi = {
  async getComments(postId: number) {
    const response = await axiosInstance.get<CommentListResponse>(`/posts/${postId}/comments`)
    console.log('API 获取评论响应:', response.data)
    return response
  },

  async createComment(postId: number, data: CreateCommentData) {
    const response = await axiosInstance.post<CommentResponse>(`/posts/${postId}/comments`, data)
    console.log('API 创建评论响应:', response.data)
    return response
  },

  async reactToComment(commentId: number, action: 'like' | 'dislike') {
    const response = await axiosInstance.post<CommentActionResponse>(
      `/comments/${commentId}/${action}`
    )
    console.log('API 点赞/点踩响应:', response.data)
    return response
  },

  async deleteComment(commentId: number) {
    const response = await axiosInstance.delete<CommentResponse>(`/comments/${commentId}`)
    console.log('API 删除评论响应:', response.data)
    return response
  }
} 