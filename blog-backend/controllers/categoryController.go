package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"net/http"
)

// GetCategories 获取分类列表
func GetCategories(c *gin.Context) {
	var categories []models.Category
	db := config.DB

	// 查询所有分类
	result := db.Find(&categories)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取分类列表失败：" + result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// CreateCategory 创建分类
func CreateCategory(c *gin.Context) {
	var category models.Category
	db := config.DB

	// 绑定传入的 JSON 数据到 category 对象
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 保存分类
	if err := db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建分类失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "分类创建成功"})
}

// UpdateCategory 更新分类信息
func UpdateCategory(c *gin.Context) {
	var category models.Category
	db := config.DB
	categoryID := c.Param("id")

	// 查找分类
	if err := db.Where("id = ?", categoryID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "分类未找到"})
		return
	}

	// 绑定更新数据
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 保存更新后的分类
	if err := db.Save(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新分类失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "分类更新成功"})
}

// DeleteCategory 删除分类
func DeleteCategory(c *gin.Context) {
	var category models.Category
	db := config.DB
	categoryID := c.Param("id")

	// 查找分类
	if err := db.Where("id = ?", categoryID).First(&category).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "分类未找到"})
		return
	}

	// 删除分类
	if err := db.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除分类失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "分类删除成功"})
}
