package audio

// Type 音频类型
type Type string

const (
	// Unknown 未知类型
	Unknown Type = "unknown"
	// Ambient 背景音乐
	Ambient Type = "ambient"
	// Effect 音效
	Effect Type = "effect"
)
