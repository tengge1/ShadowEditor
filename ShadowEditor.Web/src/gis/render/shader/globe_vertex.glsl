uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vNormal;
varying vec2 vUV;

void main() {
    vec3 transformed = vec3(position);

    transformed.z = sqrt(1.0 * 1.0 - transformed.x * transformed.x - transformed.y * transformed.y);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

    vNormal = normal;
    vUV = uv;
}