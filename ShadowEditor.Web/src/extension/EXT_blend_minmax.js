/**
 * The EXT_blend_minmax extension is part of the WebGL API and 
 * extends blending capabilities by adding two new blend equations: 
 * the minimum or maximum color components of the source and destination colors.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax
 */
function EXT_blend_minmax(gl) {
    var extension = gl.getExtension('EXT_blend_minmax');

    this.MAX_EXT = extension.MAX_EXT;
    this.MIN_EXT = extension.MIN_EXT;
}