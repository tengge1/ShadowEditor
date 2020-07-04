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
 * The EXT_sRGB extension is part of the WebGL API and 
 * adds sRGB support to textures and framebuffer objects.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB
 */
function EXT_sRGB(gl) {
    return gl.getExtension('EXT_sRGB');
}

export default EXT_sRGB;