precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float domWidth;
uniform float domHeight;
uniform float width;
uniform float height;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    mat4 modelViewMatrix_ = mat4(modelViewMatrix);
    modelViewMatrix_[3][0] = 0.5;
    modelViewMatrix_[3][1] = 0.15;
    modelViewMatrix_[3][2] = -0.5;

    vec4 mvPosition = modelViewMatrix_ * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}