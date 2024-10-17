package models

import "time"

type Post struct {
	ID        uint   `gorm:"primaryKey"`
	Title     string `gorm:"type:varchar(100)"`
	Content   string `gorm:"type:text"`
	Category  string `gorm:"type:varchar(50)"`
	Tags      string `gorm:"type:varchar(100)"`
	Views     int    `gorm:"type:int"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
