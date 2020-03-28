package system

// OperatingAuthoritySaveModel 操作权限保存模型
type OperatingAuthoritySaveModel struct {
	// 角色ID
	RoleID string
	// 权限
	Authorities []string
}
