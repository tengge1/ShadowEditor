varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vNormal = normalize( normalMatrix * normal );
    
    vec3 transformed = vec3( position );
    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
    vViewPosition = - mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
}