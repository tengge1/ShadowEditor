attribute vec3 position;
attribute vec3 normal;
attribute vec3 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec4 vTransformed;
varying vec3 vNormal;
varying vec3 vUV; 

void main()
{
    vec4 transformed =  modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * transformed;

    vTransformed = transformed;
    vNormal = normal;
    vUV = uv;
}