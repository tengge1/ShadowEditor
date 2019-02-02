precision highp float;
precision highp int;

// 物体
uniform vec3 color;

// 环境光
uniform vec3 ambientColor;

// 漫反射
uniform vec3 lightPosition;
uniform vec3 diffuseColor;

// 镜面反射
uniform float shininess;
uniform vec3 cameraPosition;
uniform mat4 normalMatrix;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // 环境光
    vec3 ambient = ambientColor * color;

    // 漫反射
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(lightPosition - vPosition);
    float dotL = max(dot(lightDirection, normal), 0.0);
    vec3 diffuse = diffuseColor * dotL * color;

    // 镜面反射
    vec3 eyeDirection = normalize(- vPosition);
    vec3 reflectionDirection = reflect(-lightDirection, normal);
    float specularLightWeight = pow(max(dot(reflectionDirection, eyeDirection), 0.0), shininess);
    vec3 specular = color * specularLightWeight;
    
    gl_FragColor = vec4(specular, 1.0);
    // gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}