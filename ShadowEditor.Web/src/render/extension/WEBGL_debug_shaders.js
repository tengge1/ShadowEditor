/**
 * The WEBGL_debug_shaders extension is part of the WebGL API and 
 * exposes a method to debug shaders from privileged contexts.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_shaders
 */
function WEBGL_debug_shaders(gl) {
    return gl.getExtension('WEBGL_debug_shaders');
}

export default WEBGL_debug_shaders;