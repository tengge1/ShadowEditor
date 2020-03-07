/**
 * The EXT_blend_minmax extension is part of the WebGL API and 
 * extends blending capabilities by adding two new blend equations: 
 * the minimum or maximum color components of the source and destination colors.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax
 */
function EXT_blend_minmax(gl) {
    return gl.getExtension('EXT_blend_minmax');
}

export default EXT_blend_minmax;