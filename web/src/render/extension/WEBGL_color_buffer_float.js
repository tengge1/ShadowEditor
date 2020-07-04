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
 * The WEBGL_color_buffer_float extension is part of the WebGL API and 
 * adds the ability to render to 32-bit floating-point color buffers.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_color_buffer_float
 */
function WEBGL_color_buffer_float(gl) {
    return gl.getExtension('WEBGL_color_buffer_float');
}

export default WEBGL_color_buffer_float;