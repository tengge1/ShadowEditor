// 参考资料：
// BRDF-双向反射分布函数：https://baike.baidu.com/item/双向反射分布函数/22311036
// 常见的三个光照模型：Lambert,Phong,BlinnPhong：https://blog.csdn.net/taoqilin/article/details/52800702
// 菲涅尔公式：https://baike.baidu.com/item/菲涅耳公式/9103788
// 菲涅尔折射率：https://baike.baidu.com/item/菲涅尔折射率/2712906

uniform vec3 diffuse; // 物体颜色
uniform float opacity; // 透明度
uniform vec3 specular; // 高光颜色
uniform float shininess; // 光亮度

uniform sampler2D map;

uniform vec3 ambientColor; // 漫反射光颜色
uniform vec3 directColor; // 平行光颜色
uniform vec3 directDirection; // 平行光方向

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// 双向反射PI
#define RECIPROCAL_PI 0.31830988618

// 菲涅尔反射
vec3 F_Schlick( const in vec3 specularColor, const in float dotLH ) {
	float fresnel = exp2( ( -5.55473 * dotLH - 6.98316 ) * dotLH );
	return ( 1.0 - specularColor ) * fresnel + specularColor;
}

// Blinn-Phong光照模型
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}

void main() {
    // 物体颜色
    vec4 diffuseColor = vec4( diffuse, opacity );
    
    vec4 texelColor = texture2D( map, vUv );
    diffuseColor *= texelColor;

    // 环境光漫反射（BRDF兰伯特漫反射）
    vec3 indirectDiffuse = ambientColor * RECIPROCAL_PI * diffuseColor.rgb;
    
    // 法线
    vec3 normal = normalize( vNormal );
	
    // 平行光漫反射（BRDF兰伯特漫反射）
    float dotNL = clamp( dot( normal, directDirection ), 0.0, 1.0 );
    vec3 irradiance = dotNL * directColor;
    vec3 directDiffuse = irradiance * RECIPROCAL_PI * diffuseColor.rgb;

    // 平行光镜面反射
    vec3 halfDir = normalize( directDirection + normalize( vViewPosition ) ); // 半角向量
	float dotNH = clamp( dot( normal, halfDir ), 0.0, 1.0 );
	float dotLH = clamp( dot( directDirection, halfDir ), 0.0, 1.0 );
	vec3 F = F_Schlick( specular, dotLH ); // 菲涅尔反射
	float D = D_BlinnPhong( shininess, dotNH ); // Blinn-Phong光照模型
	vec3 directSpecular = F * ( 0.25 * D );

    // 出射光 = 环境光漫反射 + 平行光漫反射 + 平行光镜面反射
	vec3 outgoingLight = indirectDiffuse + directDiffuse + directSpecular;
    
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}