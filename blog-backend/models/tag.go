package models

import "time"

type Tag struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	Name      string    `gorm:"type:varchar(50);uniqueIndex;not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}
