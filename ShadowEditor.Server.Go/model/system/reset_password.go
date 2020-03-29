package system

// ResetPassword 重置密码模型
type ResetPassword struct {
	// 用户ID
	UserID string
	// 新密码
	NewPassword string
	// 确认密码
	ConfirmPassword string
}
