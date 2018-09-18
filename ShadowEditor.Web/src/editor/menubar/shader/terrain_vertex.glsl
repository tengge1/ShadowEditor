varying vec2 vUv;
uniform vec2 scale;
uniform vec2 offset;

void main( void ) {
    vUv = uv * scale + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}