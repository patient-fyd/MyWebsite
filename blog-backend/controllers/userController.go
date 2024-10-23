package controllers

import (
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/middleware"
	"github.com/patient-fyd/blog-backend/models"
	"golang.org/x/crypto/bcrypt"
)

// 注册
func Register(c *gin.Context) {
	var user models.User

	// 绑定 JSON 数据到 user 结构体
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 打印接收到的用户数据用于调试
	c.JSON(http.StatusOK, gin.H{"message": "接收到的用户数据", "user": user})

	// 验证用户名和密码不为空
	if user.Username == "" || user.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "用户名和密码不能为空"})
		return
	}

	// 密码加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "密码加密失败"})
		return
	}
	user.Password = string(hashedPassword)

	// 将用户信息保存到数据库
	if err := config.DB.Create(&user).Error; err != nil {
		// 检查是否是唯一性错误（例如用户名重复）
		if strings.Contains(err.Error(), "duplicate key value") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "用户名已存在"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// 注册成功，返回成功消息和用户信息（不包括密码）
	c.JSON(http.StatusOK, gin.H{
		"message": "注册成功",
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
		},
	})
}

// Login 用户登录并生成 JWT
func Login(c *gin.Context) {
	var user models.User
	var loginData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	db := config.DB

	// 绑定 JSON 输入数据
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	// 查找用户
	if err := db.Where("username = ?", loginData.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未找到"})
		return
	}

	// 校验密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginData.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
		return
	}

	// 生成访问令牌和刷新令牌
	accessToken, refreshToken, err := middleware.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成令牌失败"})
		return
	}

	// 返回访问令牌和刷新令牌
	c.JSON(http.StatusOK, gin.H{
		"message":       "登录成功",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

// GetUser 获取用户信息
func GetUser(c *gin.Context) {
	// 从上下文中获取当前用户ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	var user models.User
	db := config.DB

	// 根据用户ID查找用户
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户未找到"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUser 更新用户信息
func UpdateUser(c *gin.Context) {
	// 从上下文中获取当前用户ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	var user models.User
	db := config.DB

	// 根据用户ID查找用户
	if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户未找到"})
		return
	}

	// 定义一个输入结构体来接收更新数据
	var input struct {
		Username string `json:"username"`
		Email    string `json:"email"`
	}

	// 绑定更新数据
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式：" + err.Error()})
		return
	}

	// 更新用户信息
	user.Username = input.Username
	user.Email = input.Email

	// 保存更新后的用户信息
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新用户信息失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "用户信息更新成功"})
}

// RefreshToken 刷新访问令牌
func RefreshToken(c *gin.Context) {
	var input struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求"})
		return
	}

	// 解析刷新令牌
	token, err := jwt.Parse(input.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		return config.JwtSecret, nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的刷新令牌"})
		return
	}

	// 从令牌中提取用户信息
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userIDFloat, userIDExists := claims["user_id"].(float64)
		username, usernameExists := claims["username"].(string)
		role, roleExists := claims["role"].(string)

		if !userIDExists || !usernameExists || !roleExists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "令牌中缺少必要信息"})
			return
		}

		// 生成新的访问令牌
		accessToken, _, err := middleware.GenerateToken(uint32(userIDFloat), username, role)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "生成新访问令牌失败"})
			return
		}

		// 返回新的访问令牌
		c.JSON(http.StatusOK, gin.H{
			"access_token": accessToken,
		})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的刷新令牌"})
	}
}
