package models

import "time"

// SiteStatistic 站点访问统计模型
type SiteStatistic struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement" json:"id"`
	Date      time.Time `gorm:"type:date;not null;uniqueIndex" json:"date"`
	PageViews uint32    `gorm:"default:0;not null" json:"page_views"`
}
