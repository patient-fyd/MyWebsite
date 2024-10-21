package models

import "time"

type User struct {
	ID               uint32     `gorm:"primaryKey" json:"id"`
	Username         string     `gorm:"type:varchar(50);uniqueIndex"`
	Password         string     `gorm:"type:varchar(255)"`
	Email            string     `gorm:"type:varchar(100);uniqueIndex"`
	Role             string     `gorm:"type:varchar(20);default:'user'"`
	ResetToken       string     `gorm:"size:64"` // 重置令牌
	VerificationCode string     `gorm:"size:6"`  // 6位验证码
	ResetTokenExpiry *time.Time `gorm:""`        // 新增字段：令牌的有效期
	CreatedAt        time.Time
	UpdatedAt        time.Time
}
