precision highp float;

varying vec4 vTransformed;

void main() {
    vec4 transformed = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * transformed;
    vTransformed = transformed;
}