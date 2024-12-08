package models

import (
	"time"
)

type Task struct {
	ID          uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	ProjectID   uint32    `gorm:"not null" json:"project_id"`
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Date        time.Time `gorm:"type:date;not null" json:"date"`
	Completed   bool      `gorm:"default:false" json:"completed"`
	UserID      uint32    `gorm:"not null" json:"user_id"`
	Project     Project   `gorm:"foreignKey:ProjectID" json:"project"`
	User        User      `gorm:"foreignKey:UserID" json:"user"`
	CreatedAt   time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"type:timestamp;autoUpdateTime" json:"updated_at"`
}
