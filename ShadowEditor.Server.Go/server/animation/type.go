package animation

// Type 动画类型
type Type string

const (
	// Unknown 未知类型
	Unknown Type = "unknown"
	// Mmd mmd模型动画
	Mmd Type = "mmd"
	// MmdCamera mmd相机动画
	MmdCamera Type = "mmdCamera"
)
