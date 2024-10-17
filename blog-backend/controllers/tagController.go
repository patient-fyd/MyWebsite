package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"net/http"
)

// GetTags 获取标签列表
func GetTags(c *gin.Context) {
	var tags []models.Tag
	db := config.DB

	// 查询所有标签
	result := db.Find(&tags)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取标签列表失败：" + result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

// CreateTag 创建标签
func CreateTag(c *gin.Context) {
	var tag models.Tag
	db := config.DB

	// 绑定传入的 JSON 数据到 tag 对象
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 保存标签
	if err := db.Create(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建标签失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "标签创建成功"})
}

// UpdateTag 更新标签信息
func UpdateTag(c *gin.Context) {
	var tag models.Tag
	db := config.DB
	tagID := c.Param("id")

	// 查找标签
	if err := db.Where("id = ?", tagID).First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "标签未找到"})
		return
	}

	// 绑定更新数据
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 保存更新后的标签
	if err := db.Save(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新标签失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "标签更新成功"})
}

// DeleteTag 删除标签
func DeleteTag(c *gin.Context) {
	var tag models.Tag
	db := config.DB
	tagID := c.Param("id")

	// 查找标签
	if err := db.Where("id = ?", tagID).First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "标签未找到"})
		return
	}

	// 删除标签
	if err := db.Delete(&tag).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除标签失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "标签删除成功"})
}
