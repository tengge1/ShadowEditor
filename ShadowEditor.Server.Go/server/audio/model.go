package audio

import "time"

// Model 音频模型
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
	// 类型
	Type string
	// 下载地址
	URL string `json:"Url"`
	// 版本号
	Version int
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 缩略图
	Thumbnail string
}
