export interface Article {
  id: number
  title: string
  content: string
  summary: string
  category_id: number
  views: number
  tags: string[]
  // 添加其他需要的字段
} 