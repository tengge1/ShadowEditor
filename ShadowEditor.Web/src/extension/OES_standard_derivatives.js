/**
 * The OES_standard_derivatives extension is part of the WebGL API and 
 * adds the GLSL derivative functions dFdx, dFdy, and fwidth.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_standard_derivatives
 */
function OES_standard_derivatives(gl) {
    return gl.getExtension('OES_standard_derivatives');
}

export default OES_standard_derivatives;