precision highp float;
precision highp int;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float domWidth;
uniform float domHeight;
uniform float right;
uniform float top;

varying vec3 vPosition;
varying vec3 vNormal;

#include <decomposeMatrix>
#include <makePerspective>

void main() {
    mat4 translation, rotation, scale;
    decomposeMatrix(viewMatrix, translation, rotation, scale);

    mat4 projectionMatrix2 = makePerspective(-0.12, 0.12, 0.04, -0.04, 0.1, 10000.0);

    vec4 mvPosition = rotation * vec4(position, 1.0);

    gl_Position = projectionMatrix * mvPosition;
    
    vPosition = vec3(mvPosition);
    vNormal = normalize(normalMatrix * normal);
}