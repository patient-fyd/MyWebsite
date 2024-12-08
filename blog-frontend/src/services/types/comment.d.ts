import type { User, BaseResponse } from './base'

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  parent_id: number | null;
  likes: number;
  dislikes: number;
  created_at: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  replies: Comment[];
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

export interface CommentListResponse {
  code: number;
  message: string;
  data: Comment[];
}

export interface CommentResponse {
  code: number;
  message: string;
  data: Comment;
}

export interface CommentActionResponse {
  code: number;
  message: string;
  data: {
    likes: number;
    dislikes: number;
    action: 'like' | 'dislike';
  };
} 