/**
 * 顶点着色器起始代码
 * @returns {String} 代码
 */
function VertexShaderStarter() {
	return `
precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

void main()	{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
}

export default VertexShaderStarter;