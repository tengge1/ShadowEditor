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
 * The EXT_frag_depth extension is part of the WebGL API and 
 * enables to set a depth value of a fragment from within the 
 * fragment shader.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth
 */
function EXT_frag_depth(gl) {
    return gl.getExtension('EXT_frag_depth');
}

export default EXT_frag_depth;