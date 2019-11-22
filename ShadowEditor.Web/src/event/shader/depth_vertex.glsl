precision highp float;

varying float depth;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    depth = gl_Position.z;
}