uniform vec3 diffuse; // 物体颜色
uniform float opacity; // 透明度

uniform sampler2D map;

uniform vec3 ambientColor; // 漫反射光颜色

varying vec2 vUv;
varying vec3 vLightFront;

// 双向反射PI
#define RECIPROCAL_PI 0.31830988618

void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    
    vec4 texelColor = texture2D( map, vUv );
    diffuseColor *= texelColor;

    // 出射光 = 直接漫反射 + 间接漫反射 
	vec3 outgoingLight = vLightFront + ambientColor * RECIPROCAL_PI * diffuseColor.rgb;

	gl_FragColor = vec4( outgoingLight, diffuseColor.a );
}