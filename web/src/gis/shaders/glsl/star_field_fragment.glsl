precision mediump float;

uniform sampler2D textureSampler;
uniform int textureEnabled;

varying float magnitudeWeight;

const vec4 white = vec4(1.0, 1.0, 1.0, 1.0);
const vec4 grey = vec4(0.5, 0.5, 0.5, 1.0);

void main() {
    if (textureEnabled == 1) {
        gl_FragColor = texture2D(textureSampler, gl_PointCoord);
    } else {
        // paint the starts in shades of grey, where the brightest star is white and the dimmest star is grey
        gl_FragColor = mix(white, grey, magnitudeWeight);
    }
}