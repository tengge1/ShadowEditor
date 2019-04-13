precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

varying vec3 vWorldDirection;

vec3 transformDirection(in vec3 dir, in mat4 matrix) {
    return normalize((matrix * vec4(dir, 0.0)).xyz);
}

void main() {
    vWorldDirection = transformDirection(position, modelMatrix);
    
    vec3 transformed = vec3(position);
    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
	gl_Position.z = gl_Position.w;
}