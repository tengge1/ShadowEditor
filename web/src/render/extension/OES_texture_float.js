/**
 * The OES_texture_float extension is part of the WebGL API and 
 * exposes floating-point pixel types for textures.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float
 */
function OES_texture_float(gl) {
    return gl.getExtension('OES_texture_float');
}

export default OES_texture_float;