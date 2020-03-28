package system

// ResetPasswordModel 重置密码模型
type ResetPasswordModel struct {
	// 用户ID
	UserID string
	// 新密码
	NewPassword string
	// 确认密码
	ConfirmPassword string
}
