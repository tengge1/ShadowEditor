/**
 * The OES_texture_half_float extension is part of the WebGL API and 
 * adds texture formats with 16- (aka half float) and 32-bit floating-point 
 * components.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_half_float
 */
function OES_texture_half_float(gl) {
    return gl.getExtension('OES_texture_half_float');
}

export default OES_texture_half_float;