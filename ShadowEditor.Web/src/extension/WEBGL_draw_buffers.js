/**
 * The WEBGL_draw_buffers extension is part of the WebGL API and 
 * enables a fragment shader to write to several textures, which 
 * is useful for deferred shading, for example.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
 */
function WEBGL_draw_buffers(gl) {
    return gl.getExtension('WEBGL_draw_buffers');
}

export default WEBGL_draw_buffers;