package audio

// Type 音频类型
type Type int

const (
	// Unknown 未知类型
	Unknown Type = iota
	// Ambient 背景音乐
	Ambient
	// Effect 音效
	Effect
)
