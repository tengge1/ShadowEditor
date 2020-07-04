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
 * The OES_vertex_array_object extension is part of the WebGL API and 
 * provides vertex array objects (VAOs) which encapsulate vertex array states. 
 * These objects keep pointers to vertex data and provide names for different 
 * sets of vertex data.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_vertex_array_object
 */
function OES_vertex_array_object(gl) {
    return gl.getExtension('OES_vertex_array_object');
}

export default OES_vertex_array_object;