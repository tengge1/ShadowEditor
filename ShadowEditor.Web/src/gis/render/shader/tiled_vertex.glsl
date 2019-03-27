varying vec2 vUV;

#define GLOBE_RADIUS 6378137.0

void main() {
    // vec3 transformed = vec3(position);

    // transformed.z = sqrt(1.0 * 1.0 - transformed.x * transformed.x - transformed.y * transformed.y);

    // transformed = transformed * GLOBE_RADIUS;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUV = uv;
}