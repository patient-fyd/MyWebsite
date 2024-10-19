package main

import (
	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/middleware"
	"github.com/patient-fyd/blog-backend/routers"
)

func main() {
	r := gin.Default()
	config.Setup()                 // 初始化配置
	r.Use(middleware.CORSConfig()) //跨域
	routers.SetupRoutes(r)         // 设置路由
	r.Run(":8080")                 // 运行服务
}
