uniform vec3 diffuse;
uniform float opacity;

uniform sampler2D map;

varying vec2 vUv;

void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );

    vec4 texelColor = texture2D( map, vUv );
	diffuseColor *= texelColor;

	gl_FragColor = diffuseColor;
}