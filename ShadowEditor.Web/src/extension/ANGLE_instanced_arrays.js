/**
 * The ANGLE_instanced_arrays extension is part of the WebGL API and 
 * allows to draw the same object, or groups of similar objects multiple 
 * times, if they share the same vertex data, primitive count and type.
 * @param {*} gl 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ANGLE_instanced_arrays
 */
function ANGLE_instanced_arrays(gl) {
    var extension = gl.getExtension('ANGLE_instanced_arrays');

    this.drawArraysInstancedANGLE = extension.drawArraysInstancedANGLE;
    this.drawElementsInstancedANGLE = extension.drawElementsInstancedANGLE;
    this.vertexAttribDivisorANGLE = extension.vertexAttribDivisorANGLE;
}