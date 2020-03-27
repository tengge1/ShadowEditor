package animation

// Type 动画类型
type Type int

const (
	// Unknown 未知类型
	Unknown Type = iota
	// Mmd mmd模型动画
	Mmd
	// MmdCamera mmd相机动画
	MmdCamera
)
