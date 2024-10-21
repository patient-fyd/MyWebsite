package models

import "time"

type Category struct {
	ID        uint32    `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(100);uniqueIndex" json:"name"`
	CreatedAt time.Time `json:"created_at"`
}
