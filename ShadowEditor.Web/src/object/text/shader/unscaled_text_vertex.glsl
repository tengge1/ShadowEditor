precision highp float;

uniform float width;
uniform float height;

varying vec2 vUv;
 
void main() {
    vUv = uv;
    vec4 proj = projectionMatrix * modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    gl_Position = vec4(
        proj.x / proj.w  + position.x * width * 2.0,
        proj.y / proj.w + position.y * height * 2.0,
        proj.z / proj.w,
        1.0
    );
}