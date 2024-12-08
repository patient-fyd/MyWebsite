import axiosInstance from '@/utils/axiosInstance'
import type { CommentListResponse, CommentResponse, CommentActionResponse } from '../types/comment'

export const commentApi = {
  // 获取评论列表
  getComments(postId: number) {
    return axiosInstance.get<CommentListResponse>(`/posts/${postId}/comments`);
  },

  // 发表评论
  createComment(postId: number, data: { content: string; parent_id?: number }) {
    return axiosInstance.post<CommentResponse>(`/posts/${postId}/comments`, data);
  },

  // 删除评论
  deleteComment(commentId: number) {
    return axiosInstance.delete<{ code: number; message: string }>(`/comments/${commentId}`);
  },

  // 点赞/点踩评论
  reactToComment(commentId: number, action: 'like' | 'dislike') {
    return axiosInstance.post<CommentActionResponse>(`/comments/${commentId}/${action}`);
  }
}; 