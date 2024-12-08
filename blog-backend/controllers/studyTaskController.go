package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
)

// GetProjects 获取用户的学习项目列表
func GetProjects(c *gin.Context) {
	var projects []models.Project
	userID := uint32(c.GetUint("userID"))
	db := config.DB

	result := db.Where("user_id = ?", userID).Find(&projects)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取项目列表失败",
		})
		return
	}

	// 获取每个项目的任务统计
	for i := range projects {
		var totalTasks, completedTasks int64
		db.Model(&models.Task{}).Where("project_id = ?", projects[i].ID).Count(&totalTasks)
		db.Model(&models.Task{}).Where("project_id = ? AND completed = ?", projects[i].ID, true).Count(&completedTasks)
		projects[i].TotalTasks = uint32(totalTasks)
		projects[i].CompletedTasks = uint32(completedTasks)
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取项目列表成功",
		"data": gin.H{
			"projects": projects,
			"total":    len(projects),
		},
	})
}

// CreateProject 创建新的学习项目
func CreateProject(c *gin.Context) {
	var input struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "请求参数错误",
		})
		return
	}

	userID := uint32(c.GetUint("userID"))
	project := models.Project{
		Name:        input.Name,
		Description: input.Description,
		UserID:      userID,
	}

	if err := config.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "创建项目失败",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "创建项目成功",
		"data":    project,
	})
}

// GetTasks 获取指定项目下的任务列表
func GetTasks(c *gin.Context) {
	var tasks []models.Task
	userID := uint32(c.GetUint("userID"))
	projectID := c.Param("project_id")
	db := config.DB

	result := db.Where("user_id = ? AND project_id = ?", userID, projectID).
		Order("date DESC").
		Find(&tasks)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取任务列表失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取任务列表成功",
		"data": gin.H{
			"tasks": tasks,
			"total": len(tasks),
		},
	})
}

// CreateTask 创建新任务
func CreateTask(c *gin.Context) {
	var input struct {
		Name        string    `json:"name" binding:"required"`
		Description string    `json:"description"`
		Date        time.Time `json:"date" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "请求参数错误",
		})
		return
	}

	userID := uint32(c.GetUint("userID"))
	projectID, err := strconv.ParseUint(c.Param("project_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "无效的项目ID",
		})
		return
	}

	task := models.Task{
		Name:        input.Name,
		Description: input.Description,
		Date:        input.Date,
		UserID:      userID,
		ProjectID:   uint32(projectID),
	}

	if err := config.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "创建任务失败",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "创建任务成功",
		"data":    task,
	})
}

// UpdateTask 更新任务状态
func UpdateTask(c *gin.Context) {
	var input struct {
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Date        time.Time `json:"date"`
		Completed   bool      `json:"completed"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "请求参数错误",
		})
		return
	}

	userID := uint32(c.GetUint("userID"))
	taskID := c.Param("task_id")

	var task models.Task
	if err := config.DB.Where("id = ? AND user_id = ?", taskID, userID).First(&task).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "任务不存在",
		})
		return
	}

	// 开启事务
	tx := config.DB.Begin()

	// 更新任务
	updates := map[string]interface{}{
		"completed": input.Completed,
	}
	if input.Name != "" {
		updates["name"] = input.Name
	}
	if input.Description != "" {
		updates["description"] = input.Description
	}
	if !input.Date.IsZero() {
		updates["date"] = input.Date
	}

	if err := tx.Model(&task).Updates(updates).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "更新任务失败",
		})
		return
	}

	// 如果任务被标记为完成，创建或更新打卡记录
	if input.Completed {
		var checkIn models.CheckIn
		today := time.Now().Format("2006-01-02")

		result := tx.Where("user_id = ? AND project_id = ? AND date = ?",
			userID, task.ProjectID, today).First(&checkIn)

		if result.Error == nil {
			// 更新现有打卡记录
			if err := tx.Model(&checkIn).Update("task_count", checkIn.TaskCount+1).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"code":    500,
					"message": "更新打卡记录失败",
				})
				return
			}
		} else {
			// 创建新的打卡记录
			newCheckIn := models.CheckIn{
				UserID:    userID,
				ProjectID: task.ProjectID,
				Date:      time.Now(),
				TaskCount: 1,
			}
			if err := tx.Create(&newCheckIn).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{
					"code":    500,
					"message": "创建打卡记录失败",
				})
				return
			}
		}
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "操作失败",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "更新任务成功",
		"data":    task,
	})
}

// GetCheckIns 获取打卡记录
func GetCheckIns(c *gin.Context) {
	userID := uint32(c.GetUint("userID"))
	projectID := c.Query("project_id")
	db := config.DB.Model(&models.CheckIn{})

	// 构建查询
	query := db.Where("user_id = ?", userID)
	if projectID != "" {
		query = query.Where("project_id = ?", projectID)
	}

	// 获取打卡记录
	var checkIns []models.CheckIn
	if err := query.Order("date DESC").Find(&checkIns).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "获取打卡记录失败",
		})
		return
	}

	// 计算统计信息
	var stats struct {
		TotalDays     int `json:"total_days"`
		CurrentStreak int `json:"current_streak"`
		MaxStreak     int `json:"max_streak"`
	}

	// ... 实现统计逻辑 ...

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "获取打卡记录成功",
		"data": gin.H{
			"checkins":   checkIns,
			"total":      len(checkIns),
			"statistics": stats,
		},
	})
}

// 其他函数实现类似，我可以继续提供完整实现
