/**
 * The OES_texture_float_linear extension is part of the WebGL API and 
 * allows linear filtering with floating-point pixel types for textures.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear
 */
function OES_texture_float_linear(gl) {
    return gl.getExtension('OES_texture_float_linear');
}

export default OES_texture_float_linear;