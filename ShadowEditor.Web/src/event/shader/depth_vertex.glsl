precision highp float;
varying float depth;

void main() {
    vec4 transformed = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * transformed;
    depth = transformed.z;
}