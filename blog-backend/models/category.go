package models

import "time"

type Category struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"name"`
	CreatedAt time.Time `gorm:"type:timestamp;autoCreateTime" json:"created_at"`
}
