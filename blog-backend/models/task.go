package models

import (
	"time"
)

type Task struct {
	ID          uint      `gorm:"primaryKey"`
	ProjectID   uint      `gorm:"not null"` // 关联到大任务
	Project     Project   `gorm:"foreignKey:ProjectID"`
	Name        string    `gorm:"type:varchar(255);not null"`
	Description string    `gorm:"type:text"`
	Date        time.Time `gorm:"type:date;not null"`
	Completed   bool      `gorm:"default:false"`
	UserID      uint      `gorm:"not null"` // 关联到用户
	User        User      `gorm:"foreignKey:UserID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
