/**
 * The EXT_sRGB extension is part of the WebGL API and 
 * adds sRGB support to textures and framebuffer objects.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_sRGB
 */
function EXT_sRGB(gl) {
    return gl.getExtension('EXT_sRGB');
}

export default EXT_sRGB;