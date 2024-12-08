package models

import "time"

type Comment struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	PostID    uint32    `gorm:"not null" json:"post_id"`
	UserID    *uint32   `gorm:"default:null" json:"user_id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	ParentID  *uint32   `gorm:"default:null" json:"parent_id"`
	Likes     uint32    `gorm:"default:0" json:"likes"`
	Dislikes  uint32    `gorm:"default:0" json:"dislikes"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Post      Post      `gorm:"foreignKey:PostID" json:"-"`
	Replies   []Comment `gorm:"foreignKey:ParentID" json:"replies"`
	CreatedAt time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
}

// CommentAction 用于记录用户对评论的操作
type CommentAction struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint32    `gorm:"not null" json:"user_id"`
	CommentID uint32    `gorm:"not null" json:"comment_id"`
	Action    string    `gorm:"type:enum('like','dislike');not null" json:"action"`
	CreatedAt time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
}
