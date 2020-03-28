package system

// AuthorityModel 权限模型
type AuthorityModel struct {
	// 编号
	ID string
	// 角色ID
	RoleID string
	// 类型（1-UI权限,2-接口权限）
	Type int
	// 权限数据（对应页面控件或服务端接口）
	Date string
}
