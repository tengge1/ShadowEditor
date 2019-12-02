precision highp float;

uniform sampler2D tDiffuse;
 
varying vec2 vUv;
 
void main() {
    vec4 texel = texture2D( tDiffuse, vUv );
    if (texel.a == 0.0) {
        discard;
    }
    gl_FragColor = texel;
}