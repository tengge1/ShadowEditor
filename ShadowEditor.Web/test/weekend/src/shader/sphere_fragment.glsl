varying vec2 vUV;

vec3 lowerLeftCorner = vec3(-2.0, -1.0, -1.0);
vec3 horizontal = vec3(4.0, 0.0, 0.0);
vec3 vertical = vec3(0.0, 2.0, 0.0);
vec3 origin = vec3(0.0, 0.0, 0.0);
vec3 sphereCenter = vec3(0.0, 0.0, -1.0);

struct Ray {
    vec3 origin;
    vec3 direction;
};

float hitSphere(vec3 center, float radius, Ray ray) {
    vec3 oc, temp;
    oc = vec3(ray.origin) - center;
    
    temp = vec3(ray.direction);
    float a = dot(temp, ray.direction);
    temp = vec3(oc);
    float b = dot(temp, ray.direction) * 2.0;
    temp = vec3(oc);
    float c = dot(temp, oc) - radius * radius;
    
    float discriminant = b * b - 4.0 * a * c;
    
    if (discriminant < 0.0) {
        return -1.0;
    } else {
        return (-b - sqrt(discriminant)) / (2.0 * a);
    }
}

vec3 calculateColor(Ray ray) {
    float t = hitSphere(sphereCenter, 0.5, ray);

    if(t > 0.0) {
        vec3 target = ray.origin + ray.direction * t - sphereCenter;
        normalize(target);

        return (target + vec3(1.0, 1.0, 1.0)) * 0.5;
    }

    t = 0.5 * (ray.direction.y + 1.0);

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