export interface Tag {
  ID: number;
  name: string;
  created_at: string;
}

export interface Author {
  id: number;
  Username: string;
  Email: string;
  Role: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  category_id: number;
  category: Category;
  author_id: number;
  author: Author;
  tags: Tag[];
  comments: { id: number; content: string }[] | null;
  views: number;
  created_at: string;
  updated_at: string;
} 