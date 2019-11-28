uniform float width;
uniform float height;

varying vec2 vUv;
 
void main() {
    vUv = uv;
    vec4 _loc = projectionMatrix * modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    gl_Position = vec4(
        _loc.x + position.x,
        _loc.y + position.y,
        0.0,
        1.0
    );
}