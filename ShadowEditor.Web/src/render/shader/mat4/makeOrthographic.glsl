/**
 * 生成正投影矩阵
 */
mat4 makeOrthographic(float left, float right, float top, float bottom, float near, float far) {
    float w = 1.0 / ( right - left );
    float h = 1.0 / ( top - bottom );
    float p = 1.0 / ( far - near );
    
    float x = ( right + left ) * w;
    float y = ( top + bottom ) * h;
    float z = ( far + near ) * p;

    return mat4(
        2 * w, 0.0,     0.0,      0.0,
        0.0,   2.0 * h, 0.0,      0.0,
        0.0,   0.0,     -2.0 * p, 0.0,
        -x,    -y,      -z,       1.0
    );
}