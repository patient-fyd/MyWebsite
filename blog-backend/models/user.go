package models

import "time"

type User struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Username  string `gorm:"type:varchar(50);uniqueIndex"`
	Password  string `gorm:"type:varchar(255)"`
	Email     string `gorm:"type:varchar(100);uniqueIndex"`
	Role      string `gorm:"type:varchar(20);default:'user'"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
