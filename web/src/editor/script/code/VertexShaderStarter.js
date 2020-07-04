/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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