package models

import "time"

type Post struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Title      string    `json:"title"`
	Content    string    `json:"content"`
	CategoryID uint      `json:"category_id"`
	Category   Category  `gorm:"foreignKey:CategoryID" json:"category"` // 关联到 Category 模型
	AuthorID   uint      `json:"author_id"`
	Author     User      `gorm:"foreignKey:AuthorID" json:"author"` // 关联到 User 模型
	Tags       []Tag     `gorm:"many2many:post_tags;" json:"tags"`
	Views      uint      `json:"views"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
