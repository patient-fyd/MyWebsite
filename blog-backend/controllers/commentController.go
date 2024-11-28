package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/middleware"
	"github.com/patient-fyd/blog-backend/models"
)

// CreateComment 添加评论功能
func CreateComment(c *gin.Context) {

	db := config.DB
	// 获取文章 ID
	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID"})
		return
	}

	// 解析请求体
	var input struct {
		Content  string  `json:"content" binding:"required"` // 评论内容
		ParentID *uint32 `json:"parent_id"`                  // 父评论ID（可选）
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 检查文章是否存在
	var post models.Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// 检查父评论是否存在（如果指定了 ParentID）
	if input.ParentID != nil {
		var parentComment models.Comment
		if err := db.First(&parentComment, *input.ParentID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Parent comment not found"})
			return
		}
	}

	// 获取用户 ID（匿名评论时为空）
	var userID *uint32
	if userIDRaw, exists := c.Get("userID"); exists {
		uid := userIDRaw.(uint32)
		userID = &uid
	}

	// 创建评论
	comment := models.Comment{
		PostID:   uint32(postID),
		UserID:   userID,
		Content:  input.Content,
		ParentID: input.ParentID,
	}
	if err := db.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create comment"})
		return
	}

	// 返回成功响应
	c.JSON(http.StatusCreated, gin.H{
		"message": "Comment created successfully",
		"data":    comment,
	})
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

	userID := userIDInterface.(uint32)

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
