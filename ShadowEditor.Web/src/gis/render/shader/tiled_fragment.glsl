precision highp float;

uniform sampler2D map;
uniform float opacity;

varying vec2 vUV;

void main() {
    gl_FragColor = texture2D(map, vUV);
    gl_FragColor.a = opacity;
}