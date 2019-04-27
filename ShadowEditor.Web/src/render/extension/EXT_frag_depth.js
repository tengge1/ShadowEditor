/**
 * The EXT_frag_depth extension is part of the WebGL API and 
 * enables to set a depth value of a fragment from within the 
 * fragment shader.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_frag_depth
 */
function EXT_frag_depth(gl) {
    return gl.getExtension('EXT_frag_depth');
}

export default EXT_frag_depth;