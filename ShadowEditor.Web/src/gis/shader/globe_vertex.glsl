uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec3 offset;

varying vec2 vUV;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);

    vUV = uv;
}