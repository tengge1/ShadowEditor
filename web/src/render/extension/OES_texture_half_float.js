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
 * The OES_texture_half_float extension is part of the WebGL API and 
 * adds texture formats with 16- (aka half float) and 32-bit floating-point 
 * components.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
 */
function OES_texture_half_float(gl) {
    return gl.getExtension('OES_texture_half_float');
}

export default OES_texture_half_float;