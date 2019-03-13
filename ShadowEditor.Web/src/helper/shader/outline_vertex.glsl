uniform float thickness;

void main() {
    vec3 objectNormal = normalize(normal);
    
    #ifdef FLIP_SIDED
        objectNormal = -objectNormal;
    #endif

    vec3 pNormal = normalMatrix * objectNormal;
    
    normalize(pNormal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0) + vec4(pNormal * thickness, 0.0);
}