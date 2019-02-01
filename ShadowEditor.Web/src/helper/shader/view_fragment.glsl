varying vec3 vNormal;

const vec3 lightColor = vec3(1.0, 0.0, 0.0);
const vec3 lightPosition = vec3(0.0, 0.0, 1.0);
const float shiness = 0.8;

void main() {
    vec3 color = lightColor * pow(max(0, cameraPosition * reflect(vNormal)), shiness);
    gl_FragColor = vec4(color, 1.0);
}