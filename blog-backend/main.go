package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/middleware"
	"github.com/patient-fyd/blog-backend/routers"
)

func main() {
	r := gin.Default()
	config.Setup()
	r.Use(middleware.CORSConfig())
	routers.SetupRoutes(r)
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
