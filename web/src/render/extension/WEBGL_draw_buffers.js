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
 * The WEBGL_draw_buffers extension is part of the WebGL API and 
 * enables a fragment shader to write to several textures, which 
 * is useful for deferred shading, for example.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
 */
function WEBGL_draw_buffers(gl) {
    return gl.getExtension('WEBGL_draw_buffers');
}

export default WEBGL_draw_buffers;