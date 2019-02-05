/**
 * 对向量应用矩阵
 */
vec3 applyMatrix4(vec3 v, mat4 m) {
    float x = v.x;
    float y = v.y;
    float z = v.z;
    
    float w = 1.0 / ( m[0][3] * x + m[1][3] * y + m[2][3] * z + m[3][3] );

    return vec3(
        (m[0][0] * x + m[1][0] * y + m[2][0] * z + m[3][0]) * w,
        (m[0][1] * x + m[1][1] * y + m[2][1] * z + m[3][1]) * w,
        (m[0][2] * x + m[1][2] * y + m[2][2] * z + m[3][2] ) * w
    );
}