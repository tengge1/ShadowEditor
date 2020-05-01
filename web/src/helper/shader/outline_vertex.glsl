uniform float thickness;

// Modified from http://forum.unity3d.com/threads/toon-outline-but-with-diffuse-surface.24668/

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vec3 norm = normalMatrix * normal;

    norm.x *= projectionMatrix[0][0];
    norm.y *= projectionMatrix[1][1];

    gl_Position.xy += norm.xy * gl_Position.z * thickness;
}