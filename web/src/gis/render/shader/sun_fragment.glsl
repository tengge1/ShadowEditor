precision highp float;
precision highp int;

uniform sampler2D map;

varying vec2 vUV;

void main() {
    gl_FragColor = texture2D(map, vUV);
}