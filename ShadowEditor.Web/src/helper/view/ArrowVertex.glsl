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

void applyMatrix4(inout vec3 v, in mat4 m) {
    float x = v.x;
    float y = v.y;
    float z = v.z;
    
    float w = 1.0 / (m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3]);
    
    v.x = (m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0]) * w;
    v.y = (m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1]) * w;
    v.z = (m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] ) * w;
}

void unproject(inout vec3 v, in mat4 projectionMatrixInverse, in mat4 cameraMatrixWorld) {
    applyMatrix4(v, projectionMatrixInverse);
    applyMatrix4(v, cameraMatrixWorld);
}

void main() {
    float x = 1.0 - right / domWidth;
    float y = 1.0 - top / domHeight;

    mat4 _modelViewMatrix = mat4(modelViewMatrix);
    _modelViewMatrix[3][0] = 0.35;
    _modelViewMatrix[3][1] = 0.18;
    _modelViewMatrix[3][2] = -0.8;

    vec4 mvPosition = _modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}