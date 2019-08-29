varying vec2 vUV;

vec3 lowerLeftCorner = vec3(-2.0, -1.0, -1.0);
vec3 horizontal = vec3(4.0, 0.0, 0.0);
vec3 vertical = vec3(0.0, 2.0, 0.0);
vec3 origin = vec3(0.0, 0.0, 0.0);

struct Ray {
    vec3 origin;
    vec3 direction;
};

vec3 calculateColor(Ray ray) {
    vec3 direction = ray.direction;
    float t = 0.5 * (direction.y + 1.0);

    return vec3(
        (1.0 - t) * 1.0 + t * 0.5,
        (1.0 - t) * 1.0 + t * 0.7,
        (1.0 - t) * 1.0 + t * 1.0
    );
}

void main() {
    Ray ray;

    ray.origin = origin;

    vec3 direction = vec3(
        lowerLeftCorner.x + vUV.s * horizontal.x + vUV.t * vertical.x,
        lowerLeftCorner.y + vUV.s * horizontal.y + vUV.t * vertical.y,
        lowerLeftCorner.z + vUV.s * horizontal.z + vUV.t * vertical.z
    );
    normalize(direction);
    ray.direction = direction;

    vec3 color = calculateColor(ray);

    gl_FragColor = vec4(color, 1.0);
}