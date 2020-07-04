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
 * 片源着色器起始代码
 * @returns {String} 代码
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