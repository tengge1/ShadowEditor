package system

import "time"

// RoleModel 角色模型
type RoleModel struct {
	// 编号
	ID string
	// 名称
	Name string
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 简介
	Description string
	// 状态（0-正常，-1删除）
	Status int
}
