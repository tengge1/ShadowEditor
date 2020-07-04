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
 * The WEBGL_debug_shaders extension is part of the WebGL API and 
 * exposes a method to debug shaders from privileged contexts.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders
 */
function WEBGL_debug_shaders(gl) {
    return gl.getExtension('WEBGL_debug_shaders');
}

export default WEBGL_debug_shaders;