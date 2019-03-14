uniform float fov;
uniform float domHeight;
uniform float thickness;

#include <angleTo>

#define PI 3.141592653589793

void main() {
    vec4 transformed = modelViewMatrix * vec4(position, 1.0);

    vec3 objectNormal = normalize(normal);
    
    #ifdef FLIP_SIDED
        objectNormal = -objectNormal;
    #endif

    vec3 transformedNormal = normalMatrix * objectNormal;
    normalize(transformedNormal);

    float thickMeter = (2.0 * min(abs(transformed.z), 50.0) * tan(fov * PI / 180.0 / 2.0)) / domHeight * thickness;

    float angle = angleTo(vec3(transformedNormal), vec3(0.0, 0.0, -1.0));
    
    gl_Position = projectionMatrix * (transformed + vec4(transformedNormal * thickMeter / sin(angle), 0.0));
}