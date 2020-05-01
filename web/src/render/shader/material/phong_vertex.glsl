precision highp float;
precision highp int;
#define SHADER_NAME MeshPhongMaterial
#define VERTEX_TEXTURES
#define GAMMA_FACTOR 2
#define MAX_BONES 0
#define BONE_TEXTURE
#define USE_SHADOWMAP
#define SHADOWMAP_TYPE_PCF_SOFT
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
#ifdef USE_TANGENT
	attribute vec4 tangent;
#endif
#ifdef USE_COLOR
	attribute vec3 color;
#endif
#ifdef USE_MORPHTARGETS
	attribute vec3 morphTarget0;
	attribute vec3 morphTarget1;
	attribute vec3 morphTarget2;
	attribute vec3 morphTarget3;
	#ifdef USE_MORPHNORMALS
		attribute vec3 morphNormal0;
		attribute vec3 morphNormal1;
		attribute vec3 morphNormal2;
		attribute vec3 morphNormal3;
	#else
		attribute vec3 morphTarget4;
		attribute vec3 morphTarget5;
		attribute vec3 morphTarget6;
		attribute vec3 morphTarget7;
	#endif
#endif
#ifdef USE_SKINNING
	attribute vec4 skinIndex;
	attribute vec4 skinWeight;
#endif

#define PHONG
varying vec3 vViewPosition;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#define PI 3.14159265359
#define PI2 6.28318530718
#define PI_HALF 1.5707963267949
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float average( const in vec3 color ) { return dot( color, vec3( 0.3333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	float distance = dot( planeNormal, point - pointOnPlane );
	return - distance * planeNormal + point;
}
float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return sign( dot( point - pointOnPlane, planeNormal ) );
}
vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {
	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float linearToRelativeLuminance( const in vec3 color ) {
	vec3 weights = vec3( 0.2126, 0.7152, 0.0722 );
	return dot( weights, color.rgb );
}
#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	attribute vec2 uv2;
	varying vec2 vUv2;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif
#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif
#ifdef USE_COLOR
	varying vec3 vColor;
#endif
#ifdef USE_FOG
	varying float fogDepth;
#endif
#ifdef USE_MORPHTARGETS
	#ifndef USE_MORPHNORMALS
	uniform float morphTargetInfluences[ 8 ];
	#else
	uniform float morphTargetInfluences[ 4 ];
	#endif
#endif
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix( const in float i ) {
			float j = i * 4.0;
			float x = mod( j, float( boneTextureSize ) );
			float y = floor( j / float( boneTextureSize ) );
			float dx = 1.0 / float( boneTextureSize );
			float dy = 1.0 / float( boneTextureSize );
			y = dy * ( y + 0.5 );
			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
			mat4 bone = mat4( v1, v2, v3, v4 );
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix( const in float i ) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif
#ifdef USE_SHADOWMAP
	#if 1 > 0
		uniform mat4 directionalShadowMatrix[ 1 ];
		varying vec4 vDirectionalShadowCoord[ 1 ];
	#endif
	#if 0 > 0
		uniform mat4 spotShadowMatrix[ 0 ];
		varying vec4 vSpotShadowCoord[ 0 ];
	#endif
	#if 0 > 0
		uniform mat4 pointShadowMatrix[ 0 ];
		varying vec4 vPointShadowCoord[ 0 ];
	#endif
#endif
#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
	#else
		uniform float logDepthBufFC;
	#endif
#endif
#if 0 > 0 && ! defined( PHYSICAL ) && ! defined( PHONG ) && ! defined( MATCAP )
	varying vec3 vViewPosition;
#endif
void main() {
#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP ) || defined( USE_EMISSIVEMAP ) || defined( USE_ROUGHNESSMAP ) || defined( USE_METALNESSMAP )
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
#endif
#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
	vUv2 = uv2;
#endif
#ifdef USE_COLOR
	vColor.xyz = color.xyz;
#endif
vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif
#ifdef USE_MORPHNORMALS
	objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];
	objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];
	objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];
	objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];
#endif
#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif
#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif
vec3 transformedNormal = normalMatrix * objectNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = normalMatrix * objectTangent;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif
#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
#endif
vec3 transformed = vec3( position );
#ifdef USE_MORPHTARGETS
	transformed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
	transformed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
	transformed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
	transformed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
	#ifndef USE_MORPHNORMALS
	transformed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];
	transformed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];
	transformed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];
	transformed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];
	#endif
#endif
#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif
#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );
#endif
vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
gl_Position = projectionMatrix * mvPosition;
#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
	#else
		gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
		gl_Position.z *= gl_Position.w;
	#endif
#endif
#if 0 > 0 && ! defined( PHYSICAL ) && ! defined( PHONG ) && ! defined( MATCAP )
	vViewPosition = - mvPosition.xyz;
#endif
	vViewPosition = - mvPosition.xyz;
#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
#endif
#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif
#ifdef USE_SHADOWMAP
	#if 1 > 0
	
		vDirectionalShadowCoord[ 0 ] = directionalShadowMatrix[ 0 ] * worldPosition;
	
	#endif
	#if 0 > 0
	
	#endif
	#if 0 > 0
	
	#endif
#endif
#ifdef USE_FOG
	fogDepth = -mvPosition.z;
#endif
}