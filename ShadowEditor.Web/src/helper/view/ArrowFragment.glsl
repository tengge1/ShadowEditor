precision highp float;
precision highp int;

uniform mat4 viewMatrix;

uniform vec3 color;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform vec3 diffuseColor;
uniform float shininess;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vec3 ambient = ambientColor * color;
    
    vec3 normal = normalize(vNormal);
    vec3 vLightPosition = vec3(0.0, 0.0, 1.0);
    vec3 lightDirection = normalize(vLightPosition - vPosition);
    float dotL = max(dot(lightDirection, normal), 0.0);
    vec3 diffuse = diffuseColor * dotL * color;

    vec3 eyeDirection = normalize(- vPosition);
    vec3 reflectionDirection = reflect(-lightDirection, normal);
    float specularLightWeight = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
    vec3 specular = color * specularLightWeight;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}