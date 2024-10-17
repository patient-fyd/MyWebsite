package models

import "time"

type Post struct {
	ID         uint   `gorm:"primaryKey"`
	Title      string `json:"title"`
	Content    string `json:"content"`
	CategoryID uint   `json:"category_id"`
	Tags       []Tag  `gorm:"many2many:post_tags;" json:"tags"` // 使用关联表
	Views      uint   `json:"views"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
