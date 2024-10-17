package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"net/http"
	"time"
)

// RecordVisit 记录站点的访问量
func RecordVisit(c *gin.Context) {
	db := config.DB

	// 获取当前日期
	currentDate := time.Now().Format("2006-01-02")

	var stat models.SiteStatistic
	result := db.Where("date = ?", currentDate).First(&stat)

	if result.RowsAffected == 0 {
		// 如果当天没有记录，则创建一条新的记录
		stat = models.SiteStatistic{Date: time.Now(), PageViews: 1}
		db.Create(&stat)
	} else {
		// 更新当天的访问量
		db.Model(&stat).UpdateColumn("page_views", stat.PageViews+1)
	}

	c.JSON(http.StatusOK, gin.H{"message": "访问记录成功"})
}

// GetStatistics 获取站点的访问统计
func GetStatistics(c *gin.Context) {
	db := config.DB
	var stats []models.SiteStatistic

	// 获取站点统计数据
	if err := db.Order("date desc").Find(&stats).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取统计数据失败"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetPopularPosts 获取热门文章
func GetPopularPosts(c *gin.Context) {
	db := config.DB
	var posts []models.Post

	// 获取浏览次数最多的文章
	if err := db.Order("views desc").Limit(10).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取热门文章失败"})
		return
	}

	c.JSON(http.StatusOK, posts)
}
