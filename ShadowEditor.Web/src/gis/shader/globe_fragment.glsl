precision highp float;

uniform sampler2D map;

varying vec2 vUV;

void main() {
    gl_FragColor = texture2D(map, vUV);
}