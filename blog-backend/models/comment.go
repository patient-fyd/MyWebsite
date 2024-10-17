package models

import "time"

type Comment struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	PostID    uint      `gorm:"not null"`
	UserID    *uint     `gorm:"default:null"` // 匿名评论时 userID 为空
	Content   string    `gorm:"type:text;not null"`
	ParentID  *uint     `gorm:"default:null"` // 嵌套评论的父评论ID
	CreatedAt time.Time `gorm:"autoCreateTime"`
	User      User      `gorm:"foreignKey:UserID"`   // 引用用户表
	Post      Post      `gorm:"foreignKey:PostID"`   // 引用文章表
	Replies   []Comment `gorm:"foreignKey:ParentID"` // 嵌套评论
}
