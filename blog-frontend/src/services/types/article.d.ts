import type { BaseResponse } from './base'

export interface Post {
  id: number;
  title: string;
  content: string;
  summary?: string;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
  updated_at: string;
  views: number;
  comments?: Comment[];
  comment_count: number;
  tags: Tag[];
}

export interface ArticleListResponse {
  code: number;
  message: string;
  data: {
    posts: Post[];
    total: number;
    page: number;
    page_size: number;
  };
}

export interface ArticleResponse {
  code: number;
  message: string;
  data: Post;
} 