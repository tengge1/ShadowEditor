attribute vec4 position;

attribute mat4 projectionMatrix;
attribute mat4 modelViewMatrix;

void main () {
  gl_Position = projectionMatrix * modelViewMatrix * position;
}