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
 * The EXT_blend_minmax extension is part of the WebGL API and 
 * extends blending capabilities by adding two new blend equations: 
 * the minimum or maximum color components of the source and destination colors.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax
 */
function EXT_blend_minmax(gl) {
    return gl.getExtension('EXT_blend_minmax');
}

export default EXT_blend_minmax;