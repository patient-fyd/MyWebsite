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
  tags: Tag[];
}

export interface ArticleListResponse {
  posts: Post[]
  total: number
}

export interface ArticleResponse {
  id: number
  title: string
  content: string
  summary?: string
  author: {
    id: number
    username: string
  }
  created_at: string
  updated_at: string
  views: number
  comments?: Comment[]
  tags: Tag[]
} 