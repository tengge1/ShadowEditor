varying vec2 vUv;

void main() {
    vUv = uv;
    
    vec3 transformed = vec3( position );
    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}