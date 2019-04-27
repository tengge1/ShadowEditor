/**
 * The WEBGL_depth_texture extension is part of the WebGL API and 
 * defines 2D depth and depth-stencil textures.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_depth_texture
 */
function WEBGL_depth_texture(gl) {
    return gl.getExtension('WEBGL_depth_texture');
}

export default WEBGL_depth_texture;