precision highp float;

uniform samplerCube tCube;
uniform float tFlip;

varying vec3 vWorldDirection;

void main() {
    gl_FragColor = textureCube(tCube, vec3(tFlip * vWorldDirection.x, vWorldDirection.yz));
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}