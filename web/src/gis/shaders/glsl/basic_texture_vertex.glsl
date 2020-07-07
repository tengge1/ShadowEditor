attribute vec4 vertexPoint;
attribute vec4 vertexTexCoord;
attribute vec4 normalVector;

uniform mat4 mvpMatrix;
uniform mat4 mvInverseMatrix;
uniform mat4 texCoordMatrix;
uniform bool applyLighting;

varying vec2 texCoord;
varying vec4 normal;

void main() {
    gl_Position = mvpMatrix * vertexPoint;
    texCoord = (texCoordMatrix * vertexTexCoord).st;
    if (applyLighting) {
        normal = mvInverseMatrix * normalVector;
    }
}