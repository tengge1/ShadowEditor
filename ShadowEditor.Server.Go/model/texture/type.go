package texture

// Type 贴图类型
type Type string

const (
	// Unknown 未知类型
	Unknown Type = "unknown"
	// AlphaMap 透明度贴图
	AlphaMap Type = "alphaMap"
	// AoMap 环境遮挡贴图
	AoMap Type = "aoMap"
	// BumpMap 凹凸贴图
	BumpMap Type = "bumpMap"
	// DiffuseMap 漫反射贴图
	DiffuseMap Type = "diffuseMap"
	// DisplacementMap 置换贴图
	DisplacementMap Type = "displacementMap"
	// EmissiveMap 发光贴图
	EmissiveMap Type = "emissiveMap"
	// EnvMap 环境贴图
	EnvMap Type = "envMap"
	// LightMap 光照贴图
	LightMap Type = "lightMap"
	// Map 颜色贴图
	Map Type = "map"
	// MetalnessMap 金属度贴图
	MetalnessMap Type = "metalnessMap"
	// NormalMap 法线贴图
	NormalMap Type = "normalMap"
	// RoughnessMap 粗糙度贴图
	RoughnessMap Type = "roughnessMap"
	// Cube 立体贴图
	Cube Type = "cube"
	// Video 视频贴图
	Video Type = "video"
	// SkyBall 天空球贴图
	SkyBall Type = "skyBall"
)
