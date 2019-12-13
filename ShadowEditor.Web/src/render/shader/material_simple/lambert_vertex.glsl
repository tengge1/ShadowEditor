uniform vec3 directColor; // 平行光颜色
uniform vec3 directDirection; // 平行光方向

#define PI 3.14159265359

varying vec2 vUv;
varying vec3 vLightFront;

void main() {
	vUv = uv;

	vec3 transformedNormal = normalMatrix * vec3( normal );

	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	float dotNL = dot( normalize( transformedNormal ), directDirection );
	vLightFront = clamp( dotNL, 0.0, 1.0 ) * PI * directColor;
}