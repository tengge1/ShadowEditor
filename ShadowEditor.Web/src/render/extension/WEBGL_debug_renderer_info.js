/**
 * The WEBGL_debug_renderer_info extension is part of the WebGL API and 
 * exposes two constants with information about the graphics driver for 
 * debugging purposes.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_debug_renderer_info
 */
function WEBGL_debug_renderer_info(gl) {
    return gl.getExtension('WEBGL_debug_renderer_info');
}

export default WEBGL_debug_renderer_info;