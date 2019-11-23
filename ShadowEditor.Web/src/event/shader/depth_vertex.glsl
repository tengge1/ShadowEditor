precision highp float;

uniform float far;

varying float depth;

void main() {
    // 参考：https://stackoverflow.com/questions/6408851/draw-the-depth-value-in-opengl-using-shaders
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    depth = gl_Position.z / far;
}