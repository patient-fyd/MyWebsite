package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID         uint32         `gorm:"primaryKey" json:"id"`
	Title      string         `json:"title"`
	Content    string         `json:"content"`
	Summary    string         `gorm:"type:text" json:"summary"`
	CategoryID uint32         `json:"category_id"`
	Category   Category       `gorm:"foreignKey:CategoryID" json:"category"`
	AuthorID   uint32         `json:"author_id"`
	Author     User           `gorm:"foreignKey:AuthorID" json:"author"`
	Tags       []Tag          `gorm:"many2many:post_tags;" json:"tags"`
	Comments   []Comment      `gorm:"foreignKey:PostID" json:"comments"`
	Views      uint32         `json:"views"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
