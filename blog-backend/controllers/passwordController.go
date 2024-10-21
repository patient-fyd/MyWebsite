package controllers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"net/smtp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/patient-fyd/blog-backend/config"
	"github.com/patient-fyd/blog-backend/models"
	"golang.org/x/crypto/bcrypt"
)

// 修改密码控制器
func ChangePassword(c *gin.Context) {
	// 获取当前登录用户的 ID
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "用户未登录"})
		return
	}

	var input struct {
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	// 绑定 JSON 输入数据
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的数据格式"})
		return
	}

	// 在数据库中查找用户
	var user models.User
	if err := config.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户未找到"})
		return
	}

	// 校验旧密码是否正确
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "旧密码不正确"})
		return
	}

	// 对新密码进行加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "加密新密码时出错"})
		return
	}

	// 只更新用户密码字段，避免更新 reset_token_expiry 和其他字段
	if err := config.DB.Model(&user).Update("password", hashedPassword).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "更新密码失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "密码修改成功"})
}

// 发送邮件
func sendResetEmail(to, verificationCode string) error {
	from := "patient.fyd@gmail.com" // 你的发件邮箱
	password := "ewzemikvvkmexacv"  // Gmail 或其他 SMTP 服务密码
	smtpHost := "smtp.gmail.com"    // SMTP 服务器
	smtpPort := "587"               // SMTP 端口

	auth := smtp.PlainAuth("", from, password, smtpHost)

	// 邮件内容
	message := []byte("Subject: 验证码\n\n" +
		"您的验证码是: " + verificationCode)

	// 使用 SMTP 发送邮件
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		fmt.Printf("Error sending email: %v\n", err)
		return err
	}

	fmt.Println("邮件发送成功")
	return nil
}

// 请求重置密码控制器
func RequestPasswordReset(c *gin.Context) {
	var input struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的邮箱地址"})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "用户未找到"})
		return
	}

	// 生成重置令牌和6位验证码
	resetToken, err := generateResetToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成重置令牌失败"})
		return
	}

	verificationCode := generateVerificationCode(resetToken) // 根据令牌生成6位验证码

	// 设置重置令牌和验证码
	expiryTime := time.Now().Add(time.Hour * 1) // 设置为 1 小时
	user.ResetToken = resetToken
	user.VerificationCode = verificationCode
	user.ResetTokenExpiry = &expiryTime

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "保存重置令牌失败"})
		return
	}

	// 发送重置密码邮件
	err = sendResetEmail(user.Email, verificationCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "发送重置邮件失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "重置密码邮件已发送"})
}

// 重置密码控制器
func ResetPassword(c *gin.Context) {
	var input struct {
		VerificationCode string `json:"verification_code" binding:"required"`
		NewPassword      string `json:"new_password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "无效的请求"})
		return
	}

	// 查找用户
	var user models.User
	if err := config.DB.Where("verification_code = ?", input.VerificationCode).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "无效的验证码"})
		return
	}

	// 检查验证码是否过期
	if user.ResetTokenExpiry != nil && time.Now().After(*user.ResetTokenExpiry) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "验证码已过期"})
		return
	}

	// 更新密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "加密新密码时出错"})
		return
	}

	user.Password = string(hashedPassword)
	user.ResetToken = ""        // 重置令牌已经使用，清空
	user.VerificationCode = ""  // 清空验证码
	user.ResetTokenExpiry = nil // 设置为 nil

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "重置密码失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "密码重置成功"})
}

// 生成随机重置令牌
func generateResetToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// 根据密钥生成更复杂的6位验证码
func generateVerificationCode(secretKey string) string {
	hash := sha256.Sum256([]byte(secretKey))

	// 获取当前时间戳的一部分作为动态因素，增加复杂性
	timestamp := time.Now().Unix()
	timeHash := sha256.Sum256([]byte(fmt.Sprintf("%d", timestamp)))

	// 混合原始哈希和时间戳哈希
	mixedHash := make([]byte, len(hash))
	for i := 0; i < len(hash); i++ {
		mixedHash[i] = hash[i] ^ timeHash[i%len(timeHash)] // 异或操作混合
	}

	// 将混合后的哈希值转换为16进制字符串
	mixedHashStr := hex.EncodeToString(mixedHash)

	// 提取6个字符，并进行额外的字符混淆
	chars := []rune(mixedHashStr)

	// 对字符进行位置变换，比如交换位置
	code := []rune{
		chars[2], chars[5], chars[8], chars[10], chars[15], chars[20],
	}

	// 将字符转换为大写返回
	return strings.ToUpper(string(code))
}
