/**
 * The EXT_color_buffer_half_float extension is part of the WebGL API and 
 * adds the ability to render to 16-bit floating-point color buffers.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_color_buffer_half_float
 */
function EXT_color_buffer_half_float(gl) {
    return gl.getExtension('EXT_color_buffer_half_float');
}

export default EXT_color_buffer_half_float;