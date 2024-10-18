package models

import (
	"gorm.io/gorm"
	"time"
)

type Post struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	Title      string         `json:"title"`
	Content    string         `json:"content"`
	CategoryID uint           `json:"category_id"`
	Category   Category       `gorm:"foreignKey:CategoryID" json:"category"`
	AuthorID   uint           `json:"author_id"`
	Author     User           `gorm:"foreignKey:AuthorID" json:"author"`
	Tags       []Tag          `gorm:"many2many:post_tags;" json:"tags"`
	Comments   []Comment      `gorm:"foreignKey:PostID" json:"comments"`
	Views      uint           `json:"views"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"` // 用于软删除
}
