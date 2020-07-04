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
 * The OES_texture_half_float_linear extension is part of the WebGL API and 
 * allows linear filtering with half floating-point pixel types for textures.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float_linear
 */
function OES_texture_half_float_linear(gl) {
    return gl.getExtension('OES_texture_half_float_linear');
}

export default OES_texture_half_float_linear;