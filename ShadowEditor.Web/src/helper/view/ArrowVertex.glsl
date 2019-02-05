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
uniform float right;
uniform float top;
uniform mat4 projectionMatrixInverse;
uniform mat4 cameraMatrixWorld;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float x = 1.0 - right / domWidth;
    float y = 1.0 - top / domHeight;

    mat4 _modelViewMatrix = mat4(modelViewMatrix);
    _modelViewMatrix[3][0] = 0.35;
    _modelViewMatrix[3][1] = 0.18;
    _modelViewMatrix[3][2] = -0.8;

    vec4 mvPosition = _modelViewMatrix * vec4(position, 1.0);

    gl_Position = mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}