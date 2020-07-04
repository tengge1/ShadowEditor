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
 * The WEBGL_debug_renderer_info extension is part of the WebGL API and 
 * exposes two constants with information about the graphics driver for 
 * debugging purposes.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
 */
function WEBGL_debug_renderer_info(gl) {
    return gl.getExtension('WEBGL_debug_renderer_info');
}

export default WEBGL_debug_renderer_info;