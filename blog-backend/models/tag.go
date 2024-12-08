package models

import (
	"errors"
	"strings"
	"time"

	"gorm.io/gorm"
)

type Tag struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(50);uniqueIndex;not null" json:"name"`
	CreatedAt time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
}

// BeforeCreate GORM 钩子，防止空标签插入
func (t *Tag) BeforeCreate(tx *gorm.DB) error {
	t.Name = strings.TrimSpace(t.Name)
	if t.Name == "" {
		return errors.New("标签名称不能为空")
	}
	return nil
}
