varying vec2 vUv;

// https://github.com/mrdoob/three.js/blob/dev/examples/js/postprocessing/OutlinePass.js

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}