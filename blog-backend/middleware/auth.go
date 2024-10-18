package middleware

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"net/http"
	"time"
)

// AuthMiddleware 是身份验证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "未提供认证令牌"})
			c.Abort()
			return
		}

		// 确保 Authorization 头部的格式是 "Bearer token"
		if len(tokenString) <= len("Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证格式"})
			c.Abort()
			return
		}

		// 移除 "Bearer " 前缀
		tokenString = tokenString[len("Bearer "):]

		// 解析 JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})

		// 检查解析 JWT 时是否发生错误
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		// 获取 JWT 中的声明信息
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		// 将用户信息存入上下文
		userID, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "令牌中缺少用户ID"})
			c.Abort()
			return
		}

		// 设置 userID 到上下文
		c.Set("userID", uint(userID))

		// 继续处理下一个中间件/路由
		c.Next()
	}
}

// GenerateToken 生成访问令牌和刷新令牌
func GenerateToken(userID uint, username, role string) (string, string, error) {
	// 创建访问令牌，有效期为 24 小时
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // 24小时后过期
	})

	accessTokenString, err := accessToken.SignedString(config.JwtSecret)
	if err != nil {
		return "", "", err
	}

	// 创建刷新令牌，有效期为 7 天，并包含用户信息
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(), // 7天后过期
	})

	refreshTokenString, err := refreshToken.SignedString(config.JwtSecret)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
