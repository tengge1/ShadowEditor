package system

// DepartmentEditModel 组织机构编辑模型
type DepartmentEditModel struct {
	// 编号
	ID string
	// 父组织机构名称
	ParentID string
	// 名称
	Name string
	// 管理员用户ID
	AdminID string
}
