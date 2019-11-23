precision highp float;

uniform mat4 projectionMatrix;

varying vec4 vTransformed;

void main() {
    float z = (projectionMatrix * vTransformed).z;

    float hex = abs(clamp(z, -1.0, 1.0)) * 16777215.0; // 0xffffff

    float r = floor(hex / 65535.0);
    float g = floor((hex - r * 65535.0) / 255.0);
    float b = floor(hex - r * 65535.0 - g * 255.0);
    float a = sign(z) >= 0.0 ? 1.0 : 0.0; // depth大于等于0，为1.0；小于0，为0.0。

    gl_FragColor = vec4(r / 255.0, g / 255.0, b / 255.0, a);
}