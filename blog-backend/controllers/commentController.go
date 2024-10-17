package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/middleware"
	"github.com/patient-fyd/blog-backend/models"
	"net/http"
)

// CreateComment 添加评论
func CreateComment(c *gin.Context) {
	var comment models.Comment
	db := config.DB

	// 绑定传入的 JSON 数据
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 检查用户是否已登录
	if userIDInterface, exists := c.Get("user_id"); exists {
		// 将 interface{} 类型的 userID 转换为 uint
		userID := userIDInterface.(uint)
		comment.UserID = &userID // 为评论绑定登录用户的 ID
	}

	// 保存评论
	if err := db.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "添加评论失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "评论添加成功"})
}

// GetComments 获取指定文章的评论列表
func GetComments(c *gin.Context) {
	var comments []models.Comment
	db := config.DB
	postID := c.Param("post_id")

	// 查询指定文章的顶层评论，并预加载子评论
	result := db.Where("post_id = ? AND parent_id IS NULL", postID).
		Preload("Replies").
		Preload("User"). // 预加载用户信息
		Find(&comments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取评论列表失败：" + result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// DeleteComment 删除评论，评论本人或管理员可以删除
func DeleteComment(c *gin.Context) {
	var comment models.Comment
	db := config.DB
	commentID := c.Param("id")

	// 获取评论
	if err := db.Where("id = ?", commentID).First(&comment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "评论未找到"})
		return
	}

	// 获取登录用户 ID
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "未授权"})
		return
	}

	userID := userIDInterface.(uint)

	// 检查用户是否是评论本人或管理员
	if comment.UserID != nil && *comment.UserID != userID {
		// 如果不是评论本人，则使用 RoleMiddleware 检查是否是管理员
		middleware.RoleMiddleware("admin")(c)
		if c.IsAborted() {
			return
		}
	}

	// 删除评论
	if err := db.Delete(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除评论失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "评论删除成功"})
}
