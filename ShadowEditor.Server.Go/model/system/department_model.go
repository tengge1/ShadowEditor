package system

// DepartmentModel 组织机构模型
type DepartmentModel struct {
	// 编号
	ID string
	// 父组织机构名称
	ParentID string
	// 名称
	Name string
	// 管理员用户ID
	AdminID string
	// 管理员名称（不存数据库）
	AdminName string
	// 状态（0-正常，-1-删除）
	Status int
}
