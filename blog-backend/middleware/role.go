package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// RoleMiddleware 检查用户角色
func RoleMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role.(string) != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "无权限进行此操作"})
			c.Abort()
			return
		}
		c.Next()
	}
}
