package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"gorm.io/gorm"
)

// CreateComment 添加评论功能
func CreateComment(c *gin.Context) {
	// 验证用户是否登录
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "请先登录后再发表评论",
			"code":    401,
		})
		return
	}

	db := config.DB
	// 获取文章 ID
	postID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无效的文章ID",
			"code":    400,
		})
		return
	}

	// 解析请求体
	var input struct {
		Content  string  `json:"content" binding:"required"` // 评论内容
		ParentID *uint32 `json:"parent_id"`                  // 父评论ID（可选）
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "请求参数错误",
			"code":    400,
		})
		return
	}

	// 检查文章是否存在
	var post models.Post
	if err := db.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "文章不存在",
			"code":    404,
		})
		return
	}

	// 检查父评论是否存在（如果指定了 ParentID）
	if input.ParentID != nil {
		var parentComment models.Comment
		if err := db.First(&parentComment, *input.ParentID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "父评论不存在",
				"code":    404,
			})
			return
		}
	}

	// 更安全的类型转换方式
	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "用户ID类型错误",
			"code":    500,
		})
		return
	}
	uid := uint32(userIDUint)

	// 创建评论
	comment := models.Comment{
		PostID:   uint32(postID),
		UserID:   &uid,
		Content:  input.Content,
		ParentID: input.ParentID,
	}

	// 创建评论后，需要预加载用户信息再返回
	if err := db.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "创建评论失败",
			"code":    500,
		})
		return
	}

	// 重新查询评论以获取完整信息
	db.Preload("User").First(&comment, comment.ID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "评论发表成功",
		"code":    201,
		"data":    comment,
	})
}

// GetComments 获取指定文章的评论列表
func GetComments(c *gin.Context) {
	var comments []models.Comment
	db := config.DB

	// 尝试从不同的路由参数中获取文章ID
	postID := c.Param("post_id")
	if postID == "" {
		postID = c.Param("id")
	}

	if postID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "缺少文章ID",
			"code":    400,
		})
		return
	}

	// 修改查询，确保正确预加载所有关联数据
	result := db.Where("post_id = ? AND parent_id IS NULL", postID).
		Preload("User").          // 预加载评论作者信息
		Preload("Replies").       // 预加载回复
		Preload("Replies.User").  // 预加载回复的作者信息
		Order("created_at DESC"). // 按时间倒序排列
		Find(&comments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "获取评论列表失败",
			"code":    500,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "获取评论列表成功",
		"code":    200,
		"data":    comments,
	})
}

// DeleteComment 删除评论，评论本人或管理员可以删除
func DeleteComment(c *gin.Context) {
	var comment models.Comment
	db := config.DB
	commentID := c.Param("id")

	// 获取评论
	if err := db.Where("id = ?", commentID).First(&comment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "评论未找到",
		})
		return
	}

	// 获取登录用户 ID 和角色
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "未授权",
		})
		return
	}

	role, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "未授权",
		})
		return
	}

	// 检查用户是否是评论作者或管理员
	uid := uint32(userID.(uint))
	if comment.UserID == nil || *comment.UserID != uid {
		// 如果不是评论作者，检查是否是管理员
		if role.(string) != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"code":    403,
				"message": "没有权限删除此评论",
			})
			return
		}
	}

	// 删除评论及其所有子评论
	if err := db.Delete(&models.Comment{}, "id = ? OR parent_id = ?", commentID, commentID).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "删除评论失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "评论删除成功",
	})
}

// LikeComment 点赞评论
func LikeComment(c *gin.Context) {
	c.Set("action", "like")
	HandleCommentAction(c)
}

// DislikeComment 点踩评论
func DislikeComment(c *gin.Context) {
	c.Set("action", "dislike")
	HandleCommentAction(c)
}

// HandleCommentAction 处理评论的点赞和点踩
func HandleCommentAction(c *gin.Context) {
	// 验证用户是否登录
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "请先登录",
			"code":    401,
		})
		return
	}

	// 更安全的类型转换方式
	userIDUint, ok := userID.(uint)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "用户ID类型错误",
			"code":    500,
		})
		return
	}
	uid := uint32(userIDUint)

	// 获取评论ID
	commentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无效的评论ID",
			"code":    400,
		})
		return
	}

	// 从上下文获取 action，而不是从请求体
	action, exists := c.Get("action")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "无效的操作类型",
			"code":    400,
		})
		return
	}

	// 使用获取到的 action
	actionStr := action.(string)

	db := config.DB
	var comment models.Comment

	// 检查评论是否存在
	if err := db.First(&comment, commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "评论不存在",
			"code":    404,
		})
		return
	}

	// 开启事务
	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "开启事务失败",
			"code":    500,
		})
		return
	}

	// 检查用户是否已经对该评论进行过操作
	var existingAction models.CommentAction
	err = tx.Where("user_id = ? AND comment_id = ?", uid, commentID).First(&existingAction).Error

	if err == nil {
		// 如果已经有操作记录
		if existingAction.Action == actionStr {
			// 如果是相同的操作，则取消操作
			var updateErr error
			if actionStr == "like" {
				updateErr = tx.Model(&comment).Update("likes", gorm.Expr("GREATEST(likes - ?, 0)", 1)).Error
			} else {
				updateErr = tx.Model(&comment).Update("dislikes", gorm.Expr("GREATEST(dislikes - ?, 0)", 1)).Error
			}
			if updateErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "更新计数失败",
					"code":    500,
				})
				return
			}

			if err := tx.Delete(&existingAction).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "删除操作记录失败",
					"code":    500,
				})
				return
			}
		} else {
			// 如果是不同的操作，则更新操作类型
			var updateErr error
			if actionStr == "like" {
				updateErr = tx.Model(&comment).Updates(map[string]interface{}{
					"likes":    gorm.Expr("likes + ?", 1),
					"dislikes": gorm.Expr("GREATEST(dislikes - ?, 0)", 1),
				}).Error
			} else {
				updateErr = tx.Model(&comment).Updates(map[string]interface{}{
					"likes":    gorm.Expr("GREATEST(likes - ?, 0)", 1),
					"dislikes": gorm.Expr("dislikes + ?", 1),
				}).Error
			}
			if updateErr != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "更新计数失败",
					"code":    500,
				})
				return
			}

			if err := tx.Model(&existingAction).Update("action", actionStr).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"message": "更新操作类型失败",
					"code":    500,
				})
				return
			}
		}
	} else {
		// 如果没有操作记录，则创建新的操作
		newAction := models.CommentAction{
			UserID:    uid,
			CommentID: uint32(commentID),
			Action:    actionStr,
		}
		if err := tx.Create(&newAction).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "创建操作记录失败",
				"code":    500,
			})
			return
		}

		// 更新评论的点赞/点踩数
		var updateErr error
		if actionStr == "like" {
			updateErr = tx.Model(&comment).Update("likes", gorm.Expr("likes + ?", 1)).Error
		} else {
			updateErr = tx.Model(&comment).Update("dislikes", gorm.Expr("dislikes + ?", 1)).Error
		}
		if updateErr != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": "更新计数失败",
				"code":    500,
			})
			return
		}
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "操作失败",
			"code":    500,
		})
		return
	}

	// 重新获取更新后的评论数据
	db.First(&comment, commentID)

	c.JSON(http.StatusOK, gin.H{
		"message": "操作成功",
		"code":    200,
		"data": gin.H{
			"likes":    comment.Likes,
			"dislikes": comment.Dislikes,
			"action":   actionStr,
		},
	})
}
