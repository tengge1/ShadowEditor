// https://github.com/mrdoob/three.js/blob/dev/examples/js/postprocessing/OutlinePass.js

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}