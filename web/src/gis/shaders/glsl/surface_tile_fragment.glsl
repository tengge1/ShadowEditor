precision mediump float;
/* Uniform sampler indicating the texture 2D unit (0, 1, 2, etc.) to use when sampling texture color. */
uniform sampler2D texSampler;
uniform float opacity;
uniform vec4 color;
uniform bool modulateColor;

varying vec2 texSamplerCoord;
varying vec2 texMaskCoord;

/*
 * Returns true when the texture coordinate samples texels outside the texture image.
 */
bool isInsideTextureImage(const vec2 coord) {
    return coord.x >= 0.0 && coord.x <= 1.0 && coord.y >= 0.0 && coord.y <= 1.0;
}

/*
 * OpenGL ES Shading Language v1.00 fragment shader for SurfaceTileRendererProgram. Writes the value of the texture 2D
 * object bound to texSampler at the current transformed texture coordinate, multiplied by the uniform opacity. Writes
 * transparent black (0, 0, 0, 0) if the transformed texture coordinate indicates a texel outside of the texture data's
 * standard range of [0,1].
 */
void main(void) {
    float mask = float(isInsideTextureImage(texMaskCoord));
    if (modulateColor) {
        gl_FragColor = color * mask * floor(texture2D(texSampler, texSamplerCoord).a + 0.5);
    } else {
        /* Return either the sampled texture2D color multiplied by opacity or transparent black. */
        gl_FragColor = texture2D(texSampler, texSamplerCoord) * mask * opacity;
    }
}