package models

import "time"

type Category struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
