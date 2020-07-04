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
 * The OES_standard_derivatives extension is part of the WebGL API and 
 * adds the GLSL derivative functions dFdx, dFdy, and fwidth.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives
 */
function OES_standard_derivatives(gl) {
    return gl.getExtension('OES_standard_derivatives');
}

export default OES_standard_derivatives;