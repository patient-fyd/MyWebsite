package models

import (
	"time"
)

type Project struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"type:varchar(255);not null"`
	Description string `gorm:"type:text"`
	UserID      uint   `gorm:"not null"` // 关联到用户
	User        User   `gorm:"foreignKey:UserID"`
	Tasks       []Task `gorm:"foreignKey:ProjectID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
