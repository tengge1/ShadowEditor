uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec3 uv;
attribute vec3 offset;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}