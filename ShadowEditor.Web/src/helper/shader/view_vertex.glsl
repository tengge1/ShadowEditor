uniform float domWidth;
uniform float domHeight;
uniform float width;
uniform float height;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float x = position.x * width / domWidth + (domWidth - width) / domWidth;
    float y = position.y * width / domWidth + (domHeight - height) / domHeight;

    gl_Position = vec4(x, y, position.z, 1.0);

    vPosition = vec3(x, y, 0.0);
    vNormal = normal;
}