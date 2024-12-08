package models

import (
	"time"
)

// Project 学习项目模型
type Project struct {
	ID             uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name           string    `gorm:"type:varchar(255);not null" json:"name"`
	Description    string    `gorm:"type:text" json:"description"`
	UserID         uint32    `gorm:"not null" json:"user_id"`
	TotalTasks     uint32    `gorm:"-" json:"total_tasks"`     // 总任务数（非数据库字段）
	CompletedTasks uint32    `gorm:"-" json:"completed_tasks"` // 已完成任务数（非数据库字段）
	User           User      `gorm:"foreignKey:UserID" json:"user"`
	Tasks          []Task    `gorm:"foreignKey:ProjectID" json:"tasks"`
	CreatedAt      time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
	UpdatedAt      time.Time `gorm:"type:timestamp;autoUpdateTime" json:"updated_at"`
}
