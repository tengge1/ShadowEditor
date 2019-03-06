uniform float thickness;

void main() {
    vec3 objectNormal = normalize(normal);
    
    #ifdef FLIP_SIDED
        objectNormal = -objectNormal;
    #endif
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + objectNormal * thickness, 1.0);
}