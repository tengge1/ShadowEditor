precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float domWidth;
uniform float domHeight;
uniform float size;
uniform float z;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    mat4 translateMatrix = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        1.0 - size / domWidth, 1.0 - size / domHeight, 0.0, 1.0
    );

    mat4 _modelViewMatrix = modelViewMatrix;
    _modelViewMatrix[3][0] = 0.0;
    _modelViewMatrix[3][1] = 0.0;
    _modelViewMatrix[3][2] = -z;
    
    vec4 mvPosition = _modelViewMatrix * vec4(position, 1.0);

    gl_Position = translateMatrix * projectionMatrix * mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}