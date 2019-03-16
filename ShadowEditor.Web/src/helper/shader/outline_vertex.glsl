uniform float thickness;

// Modified from http://forum.unity3d.com/threads/toon-outline-but-with-diffuse-surface.24668/

void main() {
    vec4 transformed = modelViewMatrix * vec4(position, 1.0);

    vec3 objectNormal = normalize(normal);
    
    #ifdef FLIP_SIDED
        objectNormal = -objectNormal;
    #endif

    vec3 transformedNormal = normalMatrix * objectNormal;
    normalize(transformedNormal);

    transformedNormal.x *= projectionMatrix[0][0];
    transformedNormal.y *= projectionMatrix[1][1];

    vec4 clip = projectionMatrix * transformed;
    clip.xy += transformedNormal.xy * clip.w * thickness / abs(transformed.z);
    
    gl_Position = clip;
}