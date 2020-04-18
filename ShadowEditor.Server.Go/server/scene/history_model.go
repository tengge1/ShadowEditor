package scene

import "time"

// HistoryModel 场景历史模型
type HistoryModel struct {
	// 场景历史ID
	ID string
	// 场景ID
	SceneID string
	// 场景名称
	SceneName string
	// 版本
	Version int
	// 是否最新版本
	IsNew bool
	// 创建时间
	CreateTime time.Time
	// 更新时间
	UpdateTime time.Time
}
