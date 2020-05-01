precision highp float;

uniform sampler2D tDiffuse;
uniform float width;
uniform float height;
 
varying vec2 vUv;
 
void main() {
    // 注意vUv一定要从画布整数坐标+0.5处取颜色，否则会导致文字模糊问题。
    vec2 _uv = vec2(
        (floor(vUv.s * width) + 0.5) / width,
        (floor(vUv.t * height) + 0.5) / height
    );

    gl_FragColor = texture2D( tDiffuse, _uv );

    if (gl_FragColor.a == 0.0) {
        discard;
    }

    if (_uv.s < 0.0 || _uv.s > 1.0 || _uv.t < 0.0 || _uv.t > 1.0) {
        discard;
    }
}