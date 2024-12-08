package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/controllers"
	"github.com/patient-fyd/blog-backend/middleware"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		// 认证相关路由组
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.POST("/refresh-token", controllers.RefreshToken)
			auth.POST("/change-password", middleware.AuthMiddleware(), controllers.ChangePassword)
			auth.POST("/request-password-reset", controllers.RequestPasswordReset)
			auth.POST("/reset-password", controllers.ResetPassword)
		}

		// 用户信息管理
		api.GET("/user", middleware.AuthMiddleware(), controllers.GetUser)
		api.PUT("/user", middleware.AuthMiddleware(), controllers.UpdateUser)

		// 文章管理（需要用户认证的操作）
		api.POST("/posts", middleware.AuthMiddleware(), controllers.CreatePost)
		api.GET("/posts", controllers.GetPosts)
		api.GET("/posts/:id", controllers.GetPost)
		api.PUT("/posts/:id", middleware.AuthMiddleware(), controllers.UpdatePost)
		api.DELETE("/posts/:id", middleware.AuthMiddleware(), controllers.DeletePost)
		api.POST("/posts/:id/comments", middleware.AuthMiddleware(), controllers.CreateComment) // 发表评论需要登录
		api.GET("/posts/:id/comments", controllers.GetComments)                                 // 获取文章的评论列表
		api.POST("/search", controllers.SearchPosts)                                            // 搜索功能

		// 分类管理（需要用户认证的操作）
		api.GET("/categories", controllers.GetCategories)                                      // 获取分类列表
		api.GET("/posts/category/:category_id", controllers.GetPostsByCategoryID)              // 获取分类下的文章列表
		api.POST("/categories", middleware.AuthMiddleware(), controllers.CreateCategory)       // 创建分类
		api.PUT("/categories/:id", middleware.AuthMiddleware(), controllers.UpdateCategory)    // 更新分类
		api.DELETE("/categories/:id", middleware.AuthMiddleware(), controllers.DeleteCategory) // 删除分类

		// 标签管理（需要用户认证的操作）
		api.GET("/tags", controllers.GetTags)                                       // 获取标签列表
		api.POST("/tags", middleware.AuthMiddleware(), controllers.CreateTag)       // 创建标签
		api.PUT("/tags/:id", middleware.AuthMiddleware(), controllers.UpdateTag)    // 更新标签
		api.DELETE("/tags/:id", middleware.AuthMiddleware(), controllers.DeleteTag) // 删除标签

		// 评论管理
		commentRoutes := api.Group("/comments")
		{
			commentRoutes.GET("/:post_id", controllers.GetComments)                                     // 获取评论不需要登录
			commentRoutes.DELETE("/:id", middleware.AuthMiddleware(), controllers.DeleteComment)        // 删除评论需要登录
			commentRoutes.POST("/:id/like", middleware.AuthMiddleware(), controllers.LikeComment)       // 点赞评论
			commentRoutes.POST("/:id/dislike", middleware.AuthMiddleware(), controllers.DislikeComment) // 点踩评论
		}

		// 统计功能
		api.POST("/record-visit", controllers.RecordVisit)     // 记录站点访问
		api.GET("/statistics", controllers.GetStatistics)      // 获取站点统计数据
		api.GET("/popular-posts", controllers.GetPopularPosts) // 获取热门文章

		// 项目相关的路由
		api.GET("/projects", middleware.AuthMiddleware(), controllers.GetProjects)    // 获取用户的所有任务项目
		api.POST("/projects", middleware.AuthMiddleware(), controllers.CreateProject) // 创建新的任务项目

		// 细分任务相关的路由
		api.GET("/projects/:project_id/tasks", middleware.AuthMiddleware(), controllers.GetTasks)    // 获取指定项目下的细分任务
		api.POST("/projects/:project_id/tasks", middleware.AuthMiddleware(), controllers.CreateTask) // 创建新的细分任务
		api.PUT("/tasks/:task_id", middleware.AuthMiddleware(), controllers.UpdateTask)              // 更新细分任务

		// 打卡记录相关的路由
		api.GET("/checkins", middleware.AuthMiddleware(), controllers.GetCheckIns) // 获取用户的打卡记录

	}
}
