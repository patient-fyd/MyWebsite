import type { User, BaseResponse } from './base'

export interface Comment {
  id: number;
  post_id: number;
  user_id: number | null;
  content: string;
  parent_id: number | null;
  likes: number;
  dislikes: number;
  user: User;
  replies: Comment[];
  created_at: string;
}

export interface CommentAction {
  id: number;
  user_id: number;
  comment_id: number;
  action: 'like' | 'dislike';
  created_at: string;
}

export interface CreateCommentData {
  content: string;
  parent_id?: number;
}

export interface CommentListResponse extends BaseResponse<Comment[]> {}

export interface CommentResponse extends BaseResponse<Comment> {}

export interface CommentActionResponse extends BaseResponse<{
  likes: number;
  dislikes: number;
  action: 'like' | 'dislike';
}> {} 