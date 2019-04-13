/**
 * The WEBGL_compressed_texture_s3tc extension is part of the WebGL API and 
 * exposes four S3TC compressed texture formats.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_compressed_texture_s3tc
 */
function WEBGL_compressed_texture_s3tc(gl) {
    return gl.getExtension('WEBGL_compressed_texture_s3tc');
}

export default WEBGL_compressed_texture_s3tc;