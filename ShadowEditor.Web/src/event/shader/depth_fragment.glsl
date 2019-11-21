precision highp float;
varying float depth;

void main() {
    // float hex = (depth + 1.0) / 2.0 * 16777215.0;

    // float r = floor(hex / 65536.0);
    // float g = floor((hex - r * 65536.0) / 256.0);
    // float b = floor(hex - r * 65536.0 - g * 256.0);

    // gl_FragColor = vec4(r / 255.0, g / 255.0, b / 255.0, 1.0);
    float color = (1.0 + depth) / 4.0;
    gl_FragColor = vec4(color, 0.0, 0.0, 1.0);
}