package material

// Type 材质类型
type Type int

const (
	// LineBasicMaterial 线条材质
	LineBasicMaterial Type = iota
	// LineDashedMaterial 虚线材质
	LineDashedMaterial
	// MeshBasicMaterial 基本材质
	MeshBasicMaterial
	// MeshDepthMaterial 深度材质
	MeshDepthMaterial
	// MeshNormalMaterial 法向量材质
	MeshNormalMaterial
	// MeshLambertMaterial 兰伯特材质
	MeshLambertMaterial
	// MeshPhongMaterial 冯氏材质
	MeshPhongMaterial
	// PointCloudMaterial 点云材质
	PointCloudMaterial
	// MeshStandardMaterial 标准材质
	MeshStandardMaterial
	// MeshPhysicalMaterial 物理材质
	MeshPhysicalMaterial
	// SpriteMaterial 精灵材质
	SpriteMaterial
	// ShaderMaterial 着色器材质
	ShaderMaterial
	// RawShaderMaterial 原始着色器材质
	RawShaderMaterial
)
