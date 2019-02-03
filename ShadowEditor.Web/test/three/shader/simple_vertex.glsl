precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    vPosition = vec3(modelMatrix * vec4(position, 1.0));
    vNormal = normalize(mat3(normalMatrix) * normal);
}