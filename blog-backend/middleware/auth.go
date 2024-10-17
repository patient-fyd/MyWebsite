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

		// 移除 "Bearer " 前缀
		tokenString = tokenString[len("Bearer "):]

		// 解析 JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return config.JwtSecret, nil
		})
		// 检查解析 JWT 时是否发生错误
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// 检查是否需要刷新令牌（例如剩余时间小于1小时）
			exp := int64(claims["exp"].(float64))
			if time.Unix(exp, 0).Sub(time.Now()) < time.Hour {
				// 刷新令牌
				newToken, err := GenerateToken(uint(claims["user_id"].(float64)), claims["username"].(string), claims["role"].(string))
				if err == nil {
					c.Header("Authorization", newToken) // 将新令牌返回给客户端
				}
			}

			// 将用户信息存入上下文
			c.Set("user_id", uint(claims["user_id"].(float64)))
			c.Set("username", claims["username"].(string))
			c.Set("role", claims["role"].(string))

		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的认证令牌"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// GenerateToken 生成 JWT 令牌
func GenerateToken(userID uint, username, role string) (string, error) {
	// 创建 token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  userID,
		"username": username,
		"role":     role,                                  // 添加角色信息
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // 设置24小时后过期
	})

	// 签名并生成完整的编码后的 token 字符串
	return token.SignedString(config.JwtSecret)
}
