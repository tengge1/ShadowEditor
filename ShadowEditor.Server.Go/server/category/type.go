package category

// Type 类别类型
type Type int

const (
	// Scene 场景
	Scene Type = iota
	// Mesh 网格模型
	Mesh
	// Map 贴图
	Map
	// Texture 纹理
	Texture
	// Material 材质
	Material
	// Audio 音频
	Audio
	// Animation 动画
	Animation
	// Particle 粒子
	Particle
	// Prefab 预设体
	Prefab
	// Character 角色
	Character
	// Screenshot 截图
	Screenshot
	// Video 视频
	Video
)
