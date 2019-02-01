varying vec3 vPosition;
varying vec3 vNormal;

const vec3 color = vec3(1.0, 0.0, 0.0);
const vec3 lightPosition = vec3(0.0, 0.0, 1.0);
const vec3 lightColor = vec3(1.0, 0.0, 0.0);
const float shiness = 0.8;

void main() {
    vec3 lightDirection = normalize(lightPosition - vPosition);
    float dotL = max(dot(lightDirection, vNormal), 0.0);
    vec3 reflectDirection = reflect(-lightDirection, vNormal);
    float specularLightWeighting = pow(max(dot(reflectDirection, cameraPosition), 0.0), shiness);
    vec3 specular =  color.rgb * specularLightWeighting ;
    gl_FragColor = vec4(specular, 1.0);
}