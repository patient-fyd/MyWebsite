package config

import (
	"fmt"
	"log"

	"github.com/patient-fyd/blog-backend/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB
var JwtSecret = []byte("your_jwt_secret_key")

func Setup() {
	var err error
	dsn := "root:agbxxaql8@tcp(127.0.0.1:3306)/blogdb?charset=utf8mb4&parseTime=True&loc=Local"
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("数据库连接失败: %v", err)
	}

	// 执行自动迁移
	err = MigrateDB()
	if err != nil {
		fmt.Println("数据库迁移失败:", err)
	} else {
		fmt.Println("数据库迁移成功")
	}
}

// MigrateDB 自动迁移数据库表结构
func MigrateDB() error {
	return DB.AutoMigrate(
		&models.User{},    // 自动迁移 User 模型
		&models.Post{},    // 自动迁移 Post 模型
		&models.Comment{}, // 自动迁移 Comment 模型
		&models.SiteStatistic{},
		&models.Category{},
		&models.Tag{},
	)
}
