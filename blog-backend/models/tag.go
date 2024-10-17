package models

import (
	"errors"
	"gorm.io/gorm"
	"strings"
	"time"
)

type Tag struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Name      string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"name"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}

// BeforeCreate GORM 钩子，防止空标签插入
func (t *Tag) BeforeCreate(tx *gorm.DB) (err error) {
	t.Name = strings.TrimSpace(t.Name)
	if t.Name == "" {
		return errors.New("标签名称不能为空")
	}
	return
}
