precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;

void main()	{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * 0.01, 1.0);
  gl_Position.z = gl_Position.z + 0.1;
}