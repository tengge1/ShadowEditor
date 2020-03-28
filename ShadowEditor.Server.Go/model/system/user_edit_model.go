package system

// UserEditModel 用户编辑模型
type UserEditModel struct {
	// 编号
	ID string
	// 用户名
	Username string
	// 密码（md5+盐）
	Password string
	// 姓名
	Name string
	// 角色ID
	RoleID string
	// 组织机构ID
	DeptID string
	// 性别：0-未设置，1-男，2-女
	Gender int
	// 手机号
	Phone string
	// 电子邮件
	Email string
	// QQ号
	QQ string
}
