package models

import "time"

// SiteStatistic 站点访问统计模型
type SiteStatistic struct {
	ID        uint32    `gorm:"primaryKey;autoIncrement"`
	Date      time.Time `gorm:"type:date;not null"` // 日期字段
	PageViews uint32    `gorm:"default:0;not null"` // 每日访问量
}
