/**
 * The EXT_disjoint_timer_query extension is part of the WebGL API and 
 * provides a way to measure the duration of a set of GL commands, without 
 * stalling the rendering pipeline.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EXT_blend_minmax
 */
function EXT_disjoint_timer_query(gl) {
    var extension = gl.getExtension('EXT_disjoint_timer_query');

    this.CURRENT_QUERY_EXT = extension.CURRENT_QUERY_EXT;
    this.GPU_DISJOINT_EXT = extension.GPU_DISJOINT_EXT;
    this.QUERY_COUNTER_BITS_EXT = extension.QUERY_COUNTER_BITS_EXT;
    this.QUERY_RESULT_AVAILABLE_EXT = extension.QUERY_RESULT_AVAILABLE_EXT;
    this.QUERY_RESULT_EXT = extension.QUERY_RESULT_EXT;
    this.TIMESTAMP_EXT = extension.TIMESTAMP_EXT;
    this.TIME_ELAPSED_EXT = extension.TIME_ELAPSED_EXT;

    this.beginQueryEXT = extension.beginQueryEXT;
    this.createQueryEXT = extension.createQueryEXT;
    this.deleteQueryEXT = extension.deleteQueryEXT;
    this.endQueryEXT = extension.endQueryEXT;
    this.getQueryEXT = extension.getQueryEXT;
    this.getQueryObjectEXT = extension.getQueryObjectEXT;
    this.isQueryEXT = extension.isQueryEXT;
    this.queryCounterEXT = extension.queryCounterEXT;
}