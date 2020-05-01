precision highp float;
precision highp int;

uniform samplerCube tCube;
uniform float tFlip;

varying vec3 vWorldDirection;

void main() {
	gl_FragColor = textureCube(tCube, vec3(tFlip * vWorldDirection.x, vWorldDirection.yz));
}