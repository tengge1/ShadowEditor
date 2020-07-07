precision mediump float;

uniform float opacity;
uniform vec4 color;
uniform bool enableTexture;
uniform bool modulateColor;
uniform sampler2D textureSampler;
uniform bool applyLighting;

varying vec2 texCoord;
varying vec4 normal;

void main() {
    vec4 textureColor = texture2D(textureSampler, texCoord);
    float ambient = 0.15;
    vec4 lightDirection = vec4(0, 0, 1, 0);
    
    if (enableTexture && !modulateColor)
        gl_FragColor = textureColor * color * opacity;
    else if (enableTexture && modulateColor)
        gl_FragColor = color * floor(textureColor.a + 0.5);
    else
        gl_FragColor = color * opacity;
    if (gl_FragColor.a == 0.0) {
        discard;
    }
    if (applyLighting) {
        vec4 n = normal * (gl_FrontFacing ? 1.0 : -1.0);
        gl_FragColor.rgb *= clamp(ambient + dot(lightDirection, n), 0.0, 1.0);
    }
}