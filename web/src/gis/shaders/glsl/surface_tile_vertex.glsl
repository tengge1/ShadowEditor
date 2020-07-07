attribute vec4 vertexPoint;
attribute vec4 vertexTexCoord;

uniform mat4 mvpMatrix;
uniform mat4 texSamplerMatrix;
uniform mat4 texMaskMatrix;

varying vec2 texSamplerCoord;
varying vec2 texMaskCoord;

void main() {
    gl_Position = mvpMatrix * vertexPoint;
    /* Transform the vertex texture coordinate into sampler texture coordinates. */
    texSamplerCoord = (texSamplerMatrix * vertexTexCoord).st;
    /* Transform the vertex texture coordinate into mask texture coordinates. */
    texMaskCoord = (texMaskMatrix * vertexTexCoord).st;
}