package character

import "time"

// Model 角色模型
type Model struct {
	// ID
	ID string
	// 名称
	Name string
	// 类别ID
	CategoryID string
	// 类别名称
	CategoryName string
	// 全拼
	TotalPinYin string
	// 首字母拼音
	FirstPinYin string
	// 创建时间
	CreateTime time.Time
	// 更新时间
	UpdateTime time.Time
	Data       string
	// 缩略图
	Thumbnail string
}
