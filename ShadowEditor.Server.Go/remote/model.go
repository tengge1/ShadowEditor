package script

// Model 脚本模型
type Model struct {
	// MongoDB _id
	ID string
	// 父要素ID
	PID string
	// 名称
	Name string
	// 类型
	Type string
	// 源码
	Source string
	// THREE.js UUID
	UUID string
	// 排序
	Sort int
}
