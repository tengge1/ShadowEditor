precision highp float;
varying float depth;

void main() {
    float hex = abs(depth) * 16777215.0;

    float r = floor(hex / 65535.0);
    float g = floor((hex - r * 65535.0) / 255.0);
    float b = floor(hex - r * 65535.0 - g * 255.0);

    gl_FragColor = vec4(r / 255.0, g / 255.0, b / 255.0, 1.0);
}