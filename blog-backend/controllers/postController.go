package controllers

import (
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"gorm.io/gorm"
)

// 创建文章并关联标签
func CreatePost(c *gin.Context) {
	// 从上下文中获取当前登录用户的 ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	// 检查 userID 的实际类型并转换为 uint32
	userIDUint, ok := userID.(uint)
	if !ok {
		log.Println("userID 类型断言失败，userID 不是 uint 类型")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "用户ID类型错误"})
		return
	}
	userIDUint32 := uint32(userIDUint)

	// 定义输入结构体
	var input struct {
		Title      string   `json:"title" binding:"required"`
		Content    string   `json:"content" binding:"required"`
		Summary    string   `json:"summary"`
		CategoryID uint32   `json:"category_id" binding:"required"`
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
			tags = append(tags, tag)
		}

		// 创建文章并关联标签和作者
		post := models.Post{
			Title:      input.Title,
			Content:    input.Content,
			Summary:    input.Summary,
			CategoryID: input.CategoryID,
			AuthorID:   userIDUint32, // 使用转换后的作者ID
			Tags:       tags,
			Views:      0,
			CreatedAt:  time.Now(),
			UpdatedAt:  time.Now(),
		}

		if err := tx.Create(&post).Error; err != nil {
			log.Printf("Error creating post: %v\n", err)
			return err
		}

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
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "6"))
	offset := (page - 1) * pageSize

	// 构建基本查询
	baseQuery := db.Model(&models.Post{})

	// 获取符合条件的总记录数
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章总数失败：" + err.Error()})
		return
	}

	// 查询分页数据
	if err := baseQuery.Preload("Author").Preload("Category").Preload("Tags").
		Offset(offset).Limit(pageSize).
		Order("created_at desc").
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章列表失败：" + err.Error()})
		return
	}

	// 返回数据
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": total,
	})
}

// GetPostsByCategoryID 根据类别ID返回文章列表，支持分页
func GetPostsByCategoryID(c *gin.Context) {
	var posts []models.Post
	db := config.DB // 使用全局数据库连接

	// 获取类别ID
	categoryID := c.Param("category_id")

	// 分页参数
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("page_size", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = 6
	}

	offset := (page - 1) * pageSize

	// 构建基础查询
	baseQuery := db.Model(&models.Post{}).Where("category_id = ?", categoryID)

	// 获取符合条件的文章总数
	var total int64
	if err := baseQuery.Count(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章总数失败：" + err.Error()})
		return
	}

	// 查询分页数据
	if err := baseQuery.Preload("Author").Preload("Category").Preload("Tags").
		Offset(offset).Limit(pageSize).
		Order("created_at desc").
		Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取文章列表失败：" + err.Error()})
		return
	}

	// 返回数据
	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": total,
	})
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

	// 查找文章
	if err := db.Preload("Tags").Where("id = ?", postID).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "文章未找到"})
		return
	}

	// 定义一个输入结构体来接收更新数据
	var input struct {
		Title      string   `json:"title"`
		Content    string   `json:"content"`
		CategoryID uint32   `json:"category_id"`
		Tags       []string `json:"tags"` // 标签的名称数组
	}

	// 绑定传入的JSON数据到input对象
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 更新文章的标题、内容和分类
	post.Title = input.Title
	post.Content = input.Content
	post.CategoryID = input.CategoryID

	// 处理标签更新
	var tags []models.Tag
	for _, tagName := range input.Tags {
		tagName = strings.TrimSpace(tagName) // 去除标签名称的空格
		if tagName == "" {
			continue // 跳过空标签
		}
		var tag models.Tag
		// 查找或创建标签
		if err := db.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{Name: tagName}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新标签失败：" + err.Error()})
			return
		}
		tags = append(tags, tag)
	}

	// 检查是否有有效的标签
	if len(tags) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "至少提供一个有效的标签"})
		return
	}

	// 更新标签关联关系
	if err := db.Model(&post).Association("Tags").Replace(tags); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新标签关联失败：" + err.Error()})
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

// SearchPosts 根据标题、内容、标签进行搜索，支持分页
func SearchPosts(c *gin.Context) {
	var posts []models.Post
	db := config.DB

	// 获取查询参数
	keyword := c.Query("keyword") // 搜索的关键词（在标题、内容、摘要、标签中搜索）

	// 分页参数
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("page_size", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	// 构建基本查询
	baseQuery := db.Model(&models.Post{}).
		Joins("LEFT JOIN post_tags ON post_tags.post_id = posts.id").
		Joins("LEFT JOIN tags ON tags.id = post_tags.tag_id").
		Preload("Author").
		Preload("Category").
		Preload("Tags").
		Group("posts.id")

	// 应用搜索条件
	if keyword != "" {
		keywordPattern := "%" + keyword + "%"
		baseQuery = baseQuery.Where("posts.title LIKE ? OR posts.content LIKE ? OR posts.summary LIKE ? OR tags.name LIKE ?",
			keywordPattern, keywordPattern, keywordPattern, keywordPattern)
	}

	// 获取符合条件的总记录数
	var total int64
	countQuery := baseQuery.Session(&gorm.Session{DryRun: true}).Count(&total)
	countSQL := countQuery.Statement.SQL.String()
	countVars := countQuery.Statement.Vars

	// 手动执行计数查询
	if err := db.Raw("SELECT COUNT(*) FROM ("+countSQL+") AS sub", countVars...).Scan(&total).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取搜索结果总数失败：" + err.Error()})
		return
	}

	// 查询分页数据
	if err := baseQuery.Offset(offset).Limit(pageSize).Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "搜索文章失败：" + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"total": total,
	})
}
