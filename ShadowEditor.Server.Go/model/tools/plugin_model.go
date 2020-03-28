package tools

import "time"

// PluginModel 插件模型
type PluginModel struct {
	// 编号
	ID string
	// 名称
	Name string
	// 源码
	Source string
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 简介
	Description string
	// 状态（0-正常，1-禁用，-1删除）
	Status int
}
