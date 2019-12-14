// 参考资料：
// BRDF-双向反射分布函数：https://baike.baidu.com/item/双向反射分布函数/22311036
// 基于物理的渲染—更精确的微表面分布函数GGX: https://www.jianshu.com/p/be4f025aeb3c
// 菲涅尔公式：https://baike.baidu.com/item/菲涅耳公式/9103788
// 菲涅尔折射率：https://baike.baidu.com/item/菲涅尔折射率/2712906
// Moving Frostbite to Physically Based Rendering 3.0: https://blog.csdn.net/wodownload2/article/details/103126247

uniform vec3 diffuse; // 物体颜色
uniform float opacity; // 透明度
uniform float metalness; // 金属度
uniform float roughness; // 粗糙度

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

float G_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}

// 微表面分布函数
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}

vec3 BRDF_Specular_GGX( const in vec3 directDirection, const in vec3 normal, const in viewDir, const in vec3 specularColor, const in float roughness ) {
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( directDirection + viewDir );
	float dotNL = clamp( dot( normal, directDirection ), 0.0, 1.0 );
	float dotNV = clamp( dot( normal, viewDir ), 0.0, 1.0 );
	float dotNH = clamp( dot( normal, halfDir ), 0.0, 1.0 );
	float dotLH = clamp( dot( directDirection, halfDir ), 0.0, 1.0 );
	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_GGX_SmithCorrelated( alpha, dotNL, dotNV );
	float D = D_GGX( alpha, dotNH );
	return F * ( G * D );
}

void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    
    vec4 texelColor = texture2D( map, vUv );
    diffuseColor *= texelColor;
    
    // 法线
    vec3 normal = normalize( vNormal );

    // 环境光
    vec3 indirectDiffuse = ambientColor * RECIPROCAL_PI * diffuseColor.rgb * ( 1.0 - metalness ); // 间接漫反射
    
    // 平行光
    float dotNL = clamp( dot( normal, directDirection ), 0.0, 1.0 );
	vec3 irradiance = dotNL * directColor;
    vec3 specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalness );

    vec3 directDiffuse = irradiance * RECIPROCAL_PI * diffuseColor.rgb * ( 1.0 - metalness ); // 直接漫反射
	vec3 directSpecular = irradiance * BRDF_Specular_GGX( directDirection, normal, normalize( vViewPosition ), specularColor, clamp( roughness, 0.04, 1.0 ) ); // 直接镜面反射

    // 出射光 = 间接漫反射光 + 直接漫反射 + 直接镜面反射光
	vec3 outgoingLight = indirectDiffuse + directDiffuse + directSpecular;
    
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}