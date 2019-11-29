uniform float width;
uniform float height;
uniform vec3 location;

varying vec2 vUv;
 
void main() {
    vUv = uv;
    vec4 _loc = projectionMatrix * viewMatrix * vec4(location, 1.0);
    gl_Position = vec4(
        _loc.x + position.x * width,
        _loc.y + position.y * height,
        _loc.z,
        _loc.w
    );
}