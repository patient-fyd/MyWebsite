package models

import (
	"time"
)

type CheckIn struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint32    `gorm:"not null" json:"user_id"`
	ProjectID uint32    `gorm:"not null" json:"project_id"`
	Date      time.Time `gorm:"type:date;not null" json:"date"`
	TaskCount uint32    `gorm:"default:0" json:"task_count"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
	Project   Project   `gorm:"foreignKey:ProjectID" json:"project"`
	CreatedAt time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
}
