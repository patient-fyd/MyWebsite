package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"gorm.io/gorm"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// 创建文章并关联标签
func CreatePost(c *gin.Context) {
	// 从上下文中获取当前登录用户的 ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	// 将 userID 从 float64 转换为 uint
	userIDUint := uint(userID.(float64))

	// 定义输入结构体
	var input struct {
		Title      string   `json:"title" binding:"required"`
		Content    string   `json:"content" binding:"required"`
		CategoryID uint     `json:"category_id" binding:"required"`
		Tags       []string `json:"tags" binding:"required,min=1"` // 至少一个标签
	}

	// 绑定 JSON 输入并验证
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("Invalid input: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的输入: " + err.Error()})
		return
	}

	// 过滤空标签并去除多余空格
	var validTags []string
	for _, tagName := range input.Tags {
		tagName = strings.TrimSpace(tagName)
		if tagName != "" {
			validTags = append(validTags, tagName)
		}
	}

	// 打印过滤后的标签
	log.Printf("Valid Tags: %v\n", validTags)

	// 检查是否有有效标签
	if len(validTags) == 0 {
		log.Println("No valid tags provided.")
		c.JSON(http.StatusBadRequest, gin.H{"error": "至少提供一个有效的标签"})
		return
	}

	// 开启事务
	err := config.DB.Transaction(func(tx *gorm.DB) error {
		// 查找或创建标签
		var tags []models.Tag
		for _, tagName := range validTags {
			var tag models.Tag
			if err := tx.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
				log.Printf("Error creating tag '%s': %v\n", tagName, err)
				return err
			}
			log.Printf("Tag found or created: %v\n", tag)
			tags = append(tags, tag)
		}

		// 创建文章并关联标签和作者
		post := models.Post{
			Title:      input.Title,
			Content:    input.Content,
			CategoryID: input.CategoryID,
			AuthorID:   userIDUint, // 使用转换后的作者ID
			Tags:       tags,
			Views:      0,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}

		log.Printf("Creating post: %+v\n", post)

		if err := tx.Create(&post).Error; err != nil {
			log.Printf("Error creating post: %v\n", err)
			return err
		}

		log.Printf("Post created successfully: %+v\n", post)

		// 返回成功的响应
		c.JSON(http.StatusOK, post)
		return nil
	})

	if err != nil {
		log.Printf("Transaction failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建文章失败: " + err.Error()})
		return
	}
}

// GetPosts 获取文章列表，支持分页、分类、标签和搜索功能
func GetPosts(c *gin.Context) {
	var posts []models.Post
	db := config.DB // 使用全局数据库连接

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))
	offset := (page - 1) * pageSize

	// 过滤参数
	categoryID := c.Query("category_id")
	tagID := c.Query("tag_id")
	searchQuery := c.Query("search")

	query := db.Preload("Author").Preload("Category").Preload("Tags").Offset(offset).Limit(pageSize)

	// 应用过滤条件
	if categoryID != "" {
		query = query.Where("category_id = ?", categoryID)
	}
	if tagID != "" {
		query = query.Joins("JOIN post_tags ON post_tags.post_id = posts.id").Where("post_tags.tag_id = ?", tagID)
	}
	if searchQuery != "" {
		query = query.Where("title LIKE ? OR content LIKE ?", "%"+searchQuery+"%", "%"+searchQuery+"%")
	}

	// 执行查询
	result := query.Find(&posts)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章列表失败：" + result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}

// GetPost 获取文章详情，包括文章内容、作者信息、评论等
func GetPost(c *gin.Context) {
	var post models.Post
	db := config.DB
	postID := c.Param("id")

	// 预加载关联的 Author、Category、Tags 和 Comments
	result := db.Preload("Author").Preload("Category").Preload("Tags").Preload("Comments").Where("id = ?", postID).First(&post)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "文章未找到"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章详情失败：" + result.Error.Error()})
		}
		return
	}

	// 增加浏览次数
	db.Model(&post).UpdateColumn("views", post.Views+1)

	c.JSON(http.StatusOK, post)
}

// UpdatePost 更新文章的标题、内容、分类和标签等信息
func UpdatePost(c *gin.Context) {
	var post models.Post
	db := config.DB
	postID := c.Param("id")

	if err := db.Where("id = ?", postID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章未找到"})
		return
	}

	// 绑定传入的JSON数据到post对象
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 保存更新后的文章
	if err := db.Save(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "文章更新成功"})
}

// DeletePost 删除指定的文章（软删除）
func DeletePost(c *gin.Context) {
	var post models.Post
	db := config.DB
	postID := c.Param("id")

	// 查找文章
	if err := db.Where("id = ?", postID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章未找到"})
		return
	}

	// 软删除文章
	if err := db.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "删除文章失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "文章删除成功"})
}

// SearchPosts 根据标题、内容、标签进行搜索
func SearchPosts(c *gin.Context) {
	db := config.DB
	var posts []models.Post

	// 获取查询参数
	query := c.Query("q")

	// 搜索文章标题、内容和标签
	result := db.Joins("LEFT JOIN post_tags ON post_tags.post_id = posts.id").
		Joins("LEFT JOIN tags ON post_tags.tag_id = tags.id").
		Where("posts.title LIKE ? OR posts.content LIKE ? OR tags.name LIKE ?", "%"+query+"%", "%"+query+"%", "%"+query+"%").
		Group("posts.id").
		Find(&posts)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "搜索失败"})
		return
	}

	c.JSON(http.StatusOK, posts)
}
