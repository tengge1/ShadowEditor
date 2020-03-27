package texture

// Type 贴图类型
type Type int

const (
	// Unknown 未知类型
	Unknown Type = iota
	// AlphaMap 透明度贴图
	AlphaMap
	// AoMap 环境遮挡贴图
	AoMap
	// BumpMap 凹凸贴图
	BumpMap
	// DiffuseMap 漫反射贴图
	DiffuseMap
	// DisplacementMap 置换贴图
	DisplacementMap
	// EmissiveMap 发光贴图
	EmissiveMap
	// EnvMap 环境贴图
	EnvMap
	// LightMap 光照贴图
	LightMap
	// Map 颜色贴图
	Map
	// MetalnessMap 金属度贴图
	MetalnessMap
	// NormalMap 法线贴图
	NormalMap
	// RoughnessMap 粗糙度贴图
	RoughnessMap
	// Cube 立体贴图
	Cube
	// Video 视频贴图
	Video
	// SkyBall 天空球贴图
	SkyBall
)
