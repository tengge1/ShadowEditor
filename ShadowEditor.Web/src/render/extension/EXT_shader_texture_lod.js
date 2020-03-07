/**
 * The EXT_shader_texture_lod extension is part of the WebGL API and 
 * adds additional texture functions to the OpenGL ES Shading Language 
 * which provide the shader writer with explicit control of LOD (Level of detail).
 * @param {*} gl WebGL
 * @returns {*} Extension
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_shader_texture_lod
 */
function EXT_shader_texture_lod(gl) {
    return gl.getExtension('EXT_shader_texture_lod');
}

export default EXT_shader_texture_lod;