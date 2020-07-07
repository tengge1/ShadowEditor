precision mediump float;
precision mediump int;

const int FRAGMODE_GROUND_PRIMARY = 2;
const int FRAGMODE_GROUND_SECONDARY = 3;
const int FRAGMODE_GROUND_PRIMARY_TEX_BLEND = 4;

uniform int fragMode;
uniform sampler2D texSampler;

varying vec3 primaryColor;
varying vec3 secondaryColor;
varying vec2 texCoord;

void main (void) {
    if (fragMode == FRAGMODE_GROUND_PRIMARY) {
        gl_FragColor = vec4(primaryColor, 1.0);
    } else if (fragMode == FRAGMODE_GROUND_SECONDARY) {
        gl_FragColor = vec4(secondaryColor, 1.0);
    } else if (fragMode == FRAGMODE_GROUND_PRIMARY_TEX_BLEND) {
        vec4 texColor = texture2D(texSampler, texCoord);
        gl_FragColor = vec4(primaryColor + texColor.rgb * (1.0 - secondaryColor), 1.0);
    }
}