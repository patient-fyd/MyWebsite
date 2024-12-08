package models

import "time"

type User struct {
	ID               uint32     `gorm:"primaryKey;autoIncrement" json:"id"`
	Username         string     `gorm:"type:varchar(50);uniqueIndex;not null" json:"username"`
	Password         string     `gorm:"type:varchar(255);not null" json:"-"`
	Email            string     `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Role             string     `gorm:"type:enum('user','admin');default:'user'" json:"role"`
	ResetToken       string     `gorm:"type:varchar(64)" json:"-"`
	VerificationCode string     `gorm:"type:varchar(6)" json:"-"`
	ResetTokenExpiry *time.Time `gorm:"type:timestamp" json:"-"`
	CreatedAt        time.Time  `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
	UpdatedAt        time.Time  `gorm:"type:timestamp;autoUpdateTime" json:"updated_at"`
}
