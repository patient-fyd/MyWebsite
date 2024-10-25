package models

import (
	"time"
)

type CheckIn struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"` // 关联到用户
	User      User      `gorm:"foreignKey:UserID"`
	ProjectID uint      `gorm:"not null"` // 关联到大任务
	Project   Project   `gorm:"foreignKey:ProjectID"`
	Date      time.Time `gorm:"type:date;not null"`
	TaskCount uint      `gorm:"default:0"`
	CreatedAt time.Time
}
