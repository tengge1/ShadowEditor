attribute vec4 vertexPoint;

uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vertexPoint;
}