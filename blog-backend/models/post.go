package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID         uint32         `gorm:"primaryKey;autoIncrement" json:"id"`
	Title      string         `gorm:"type:varchar(255);not null" json:"title"`
	Content    string         `gorm:"type:text;not null" json:"content"`
	Summary    string         `gorm:"type:varchar(500)" json:"summary"`
	CategoryID uint32         `gorm:"not null" json:"category_id"`
	AuthorID   uint32         `gorm:"not null" json:"author_id"`
	Views      uint32         `gorm:"default:0" json:"views"`
	Category   Category       `gorm:"foreignKey:CategoryID" json:"category"`
	Author     User           `gorm:"foreignKey:AuthorID" json:"author"`
	Tags       []Tag          `gorm:"many2many:post_tags;" json:"tags"`
	Comments   []Comment      `gorm:"foreignKey:PostID" json:"comments"`
	CreatedAt  time.Time      `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
	UpdatedAt  time.Time      `gorm:"type:timestamp;autoUpdateTime" json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}
