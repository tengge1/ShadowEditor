precision highp float;

varying float depth;

void main() {
    // 参考：https://gamedev.stackexchange.com/questions/93055/getting-the-real-fragment-depth-in-glsl
    // float ndcDepth = (gl_FragCoord.z - near) / (far - near);
    // float clipDepth = ndcDepth / gl_FragCoord.w;

    float hex = abs(clamp(depth, -1.0, 1.0)) * 16777215.0; // 0xffffff

    float r = floor(hex / 65535.0);
    float g = floor((hex - r * 65535.0) / 255.0);
    float b = floor(hex - r * 65535.0 - g * 255.0);
    float a = sign(depth) >= 0.0 ? 1.0 : 0.0; // depth大于等于0，为1.0；小于0，为0.0。

    gl_FragColor = vec4(r / 255.0, g / 255.0, b / 255.0, a);
}