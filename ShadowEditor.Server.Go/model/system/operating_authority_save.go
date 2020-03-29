package system

// OperatingAuthoritySave 操作权限保存模型
type OperatingAuthoritySave struct {
	// 角色ID
	RoleID string
	// 权限
	Authorities []string
}
