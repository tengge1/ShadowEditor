precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}