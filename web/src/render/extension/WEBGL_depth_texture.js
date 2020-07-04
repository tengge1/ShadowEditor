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
 * The WEBGL_depth_texture extension is part of the WebGL API and 
 * defines 2D depth and depth-stencil textures.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
 */
function WEBGL_depth_texture(gl) {
    return gl.getExtension('WEBGL_depth_texture');
}

export default WEBGL_depth_texture;