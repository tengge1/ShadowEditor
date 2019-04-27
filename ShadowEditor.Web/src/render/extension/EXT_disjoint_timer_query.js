/**
 * The EXT_disjoint_timer_query extension is part of the WebGL API and 
 * provides a way to measure the duration of a set of GL commands, without 
 * stalling the rendering pipeline.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_disjoint_timer_query
 */
function EXT_disjoint_timer_query(gl) {
    return gl.getExtension('EXT_disjoint_timer_query');
}

export default EXT_disjoint_timer_query;