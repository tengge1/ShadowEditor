/**
 * The WEBGL_lose_context extension is part of the WebGL API and 
 * exposes functions to simulate losing and restoring a WebGLRenderingContext.
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context
 */
function WEBGL_lose_context(gl) {
    return gl.getExtension('WEBGL_lose_context');
}

export default WEBGL_lose_context;