package system

// ChangePasswordModel 修改密码模型
type ChangePasswordModel struct {
	// 旧密码
	OldPassword string
	// 新密码
	NewPassword string
	// 确认密码
	ConfirmPassword string
}
