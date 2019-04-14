precision highp float;
precision highp int;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 sunPosition;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUV;

vec3 applyMatrix4(vec3 v, mat4 m) {
    float x = v.x;
    float y = v.y;
    float z = v.z;
    
    float w = 1.0 / ( m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3] );

    return vec3(
        (m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0]) * w,
        (m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1]) * w,
        (m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] ) * w
    );
}

void main() {
    vec3 screenPos = applyMatrix4(applyMatrix4(sunPosition, modelViewMatrix), projectionMatrix);

    gl_Position = vec4(
        screenPos.x + position.x,
        screenPos.y + position.y,
        screenPos.z + position.z,
        1.0
    );

    vUV = uv;
}