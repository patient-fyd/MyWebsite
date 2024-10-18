package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/controllers"
	"github.com/patient-fyd/blog-backend/middleware"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// 用户注册和登录
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		api.POST("/refresh-token", controllers.RefreshToken) // 刷新令牌接口

		// 密码相关功能
		api.POST("/change-password", middleware.AuthMiddleware(), controllers.ChangePassword)
		api.POST("/request-password-reset", controllers.RequestPasswordReset)
		api.POST("/reset-password", controllers.ResetPassword)

		// 用户信息管理
		api.GET("/user", middleware.AuthMiddleware(), controllers.GetUser)    // 获取用户信息
		api.PUT("/user", middleware.AuthMiddleware(), controllers.UpdateUser) // 更新用户信息

		// 文章管理（需要用户认证的操作）
		api.POST("/posts", middleware.AuthMiddleware(), controllers.CreatePost)
		api.GET("/posts", controllers.GetPosts)
		api.GET("/posts/:id", controllers.GetPost)
		api.PUT("/posts/:id", middleware.AuthMiddleware(), controllers.UpdatePost)
		api.DELETE("/posts/:id", middleware.AuthMiddleware(), controllers.DeletePost)
		api.GET("/search", controllers.SearchPosts) // 搜索功能

		// 分类管理（需要用户认证的操作）
		api.GET("/categories", controllers.GetCategories)                                      // 获取分类列表
		api.POST("/categories", middleware.AuthMiddleware(), controllers.CreateCategory)       // 创建分类
		api.PUT("/categories/:id", middleware.AuthMiddleware(), controllers.UpdateCategory)    // 更新分类
		api.DELETE("/categories/:id", middleware.AuthMiddleware(), controllers.DeleteCategory) // 删除分类

		// 标签管理（需要用户认证的操作）
		api.GET("/tags", controllers.GetTags)                                       // 获取标签列表
		api.POST("/tags", middleware.AuthMiddleware(), controllers.CreateTag)       // 创建标签
		api.PUT("/tags/:id", middleware.AuthMiddleware(), controllers.UpdateTag)    // 更新标签
		api.DELETE("/tags/:id", middleware.AuthMiddleware(), controllers.DeleteTag) // 删除标签

		// 评论管理
		api.POST("/posts/:id/comments", controllers.CreateComment)                          // 添加评论
		api.GET("/posts/:id/comments", controllers.GetComments)                             // 获取评论列表
		api.DELETE("/comments/:id", middleware.AuthMiddleware(), controllers.DeleteComment) // 删除评论

		// 统计功能
		api.POST("/record-visit", controllers.RecordVisit)     // 记录站点访问
		api.GET("/statistics", controllers.GetStatistics)      // 获取站点统计数据
		api.GET("/popular-posts", controllers.GetPopularPosts) // 获取热门文章
	}
}
