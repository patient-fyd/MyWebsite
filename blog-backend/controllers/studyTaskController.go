package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
)

// 获取用户的任务项目
func GetProjects(c *gin.Context) {
	var projects []models.Project
	db := config.DB
	userID := c.GetUint("userID")

	if err := db.Where("user_id = ?", userID).Find(&projects).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取大任务失败"})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// 创建新的任务项目
func CreateProject(c *gin.Context) {
	var project models.Project
	userID := c.GetUint("userID")
	db := config.DB

	if err := c.ShouldBindJSON(&project); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}

	project.UserID = userID

	if err := db.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建大任务失败"})
		return
	}

	c.JSON(http.StatusOK, project)
}

// 获取指定项目下的细分任务
func GetTasks(c *gin.Context) {
	var tasks []models.Task
	userID := c.GetUint("userID")
	projectID := c.Param("project_id")
	db := config.DB

	projectIDUint, err := strconv.ParseUint(projectID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的 project_id"})
		return
	}

	if err := db.Where("user_id = ? AND project_id = ?", userID, uint(projectIDUint)).Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取细分任务失败"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// 创建细分任务
func CreateTask(c *gin.Context) {
	var task models.Task
	userID := c.GetUint("userID")
	projectID := c.Param("project_id")
	db := config.DB

	projectIDUint, err := strconv.ParseUint(projectID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的 project_id"})
		return
	}

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}

	task.UserID = userID
	task.ProjectID = uint(projectIDUint)

	if err := db.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "创建细分任务失败"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// 更新细分任务
func UpdateTask(c *gin.Context) {
	var task models.Task
	userID := c.GetUint("userID")
	taskID := c.Param("task_id")
	db := config.DB

	taskIDUint, err := strconv.ParseUint(taskID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的 task_id"})
		return
	}

	if err := db.Where("id = ? AND user_id = ?", uint(taskIDUint), userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "任务不存在"})
		return
	}

	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "请求数据格式错误"})
		return
	}

	if err := db.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新任务失败"})
		return
	}

	// 如果任务被标记为完成，更新打卡记录
	if task.Completed {
		var checkIn models.CheckIn
		date := time.Now().Format("2006-01-02")

		// 检查当天是否已有打卡记录
		if err := db.Where("user_id = ? AND project_id = ? AND date = ?", userID, task.ProjectID, date).First(&checkIn).Error; err == nil {
			checkIn.TaskCount += 1
			db.Save(&checkIn)
		} else {
			checkIn = models.CheckIn{
				UserID:    userID,
				ProjectID: task.ProjectID,
				Date:      time.Now(),
				TaskCount: 1,
			}
			db.Create(&checkIn)
		}
	}

	c.JSON(http.StatusOK, task)
}

// 获取打卡记录
func GetCheckIns(c *gin.Context) {
	var checkIns []models.CheckIn
	userID := c.GetUint("userID")
	db := config.DB

	projectID := c.Query("project_id")
	if projectID != "" {
		db = db.Where("project_id = ?", projectID)
	}

	if err := db.Where("user_id = ?", userID).Find(&checkIns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取打卡记录失败"})
		return
	}

	c.JSON(http.StatusOK, checkIns)
}
