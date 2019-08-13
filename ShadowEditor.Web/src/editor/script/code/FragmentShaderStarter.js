/**
 * 片源着色器起始代码
 */
function FragmentShaderStarter() {
	return `
precision mediump float;

void main()	{
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
}

export default FragmentShaderStarter;