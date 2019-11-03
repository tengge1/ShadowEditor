uniform sampler2D maskTexture;
uniform vec2 texSize;
uniform vec3 color;
uniform float thickness;

varying vec2 vUv;

// https://github.com/mrdoob/three.js/blob/dev/examples/js/postprocessing/OutlinePass.js

void main() {
    vec2 invSize = thickness / texSize;
    vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);

    vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);
    vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);
    vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);
    vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);
    
    float diff1 = (c1.r - c2.r)*0.5;
    float diff2 = (c3.r - c4.r)*0.5;
    
    float d = length(vec2(diff1, diff2));
    gl_FragColor = d > 0.0 ? vec4(color, 1.0) : vec4(0.0, 0.0, 0.0, 0.0);
}