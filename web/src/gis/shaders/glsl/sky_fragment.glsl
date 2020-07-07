#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

const float g = -0.95;
const float g2 = g * g;

uniform mediump vec3 lightDirection;

varying vec3 primaryColor;
varying vec3 secondaryColor;
varying vec3 direction;

void main (void) {
    float cos = dot(lightDirection, direction) / length(direction);
    float rayleighPhase = 0.75 * (1.0 + cos * cos);
    float miePhase = 1.5 * ((1.0 - g2) / (2.0 + g2)) * (1.0 + cos*cos) /
        pow(1.0 + g2 - 2.0*g*cos, 1.5);
    const float exposure = 2.0;
    vec3 color = primaryColor * rayleighPhase + secondaryColor * miePhase;
    color = vec3(1.0) - exp(-exposure * color);
    gl_FragColor = vec4(color, color.b);
}