/**
 * The EXT_texture_filter_anisotropic extension is part of the WebGL API and 
 * exposes two constants for anisotropic filtering (AF).
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_texture_filter_anisotropic
 */
function EXT_texture_filter_anisotropic(gl) {
    return gl.getExtension('EXT_texture_filter_anisotropic');
}

export default EXT_texture_filter_anisotropic;