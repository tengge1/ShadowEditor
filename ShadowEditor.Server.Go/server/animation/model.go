package animation

import "time"

// Model 动画模型
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
	// 上传文件名称
	FileName string
	// 文件大小
	FileSize int
	// 文件类型
	FileType string
	// 保存文件名称
	SaveName string
	// 保存路径
	SavePath string
	// 上传时间
	AddTime time.Time
	// 缩略图
	Thumbnail string
}
