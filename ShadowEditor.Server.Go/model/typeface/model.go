package typeface

import "time"

// Model 字体模型
type Model struct {
	// ID
	ID string
	// 名称
	Name string
	// 全拼
	TotalPinYin string
	// 首字母拼音
	FirstPinYin string
	// 下载地址
	URL string
	// 创建时间
	CreateTime time.Time
}
