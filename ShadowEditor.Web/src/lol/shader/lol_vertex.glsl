attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vNormal;
varying vec2 vTexCoord;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
    vNormal = mat3(modelViewMatrix) * normalize(normal);
    vTexCoord = uv;
}