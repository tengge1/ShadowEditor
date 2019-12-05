precision highp float;

uniform float width;
uniform float height;
uniform float domWidth;
uniform float domHeight;

varying vec2 vUv;
 
void main() {
    vUv = uv;
    vec4 proj = projectionMatrix * modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    gl_Position = vec4(
        proj.x / proj.w  + position.x * width / domWidth * 2.0,
        proj.y / proj.w + position.y * height / domHeight * 2.0,
        proj.z / proj.w,
        1.0
    );
}