/**
 * 生成透视投影矩阵
 */
mat4 makePerspective(float left, float right, float top, float bottom, float near, float far) {
    float x = 2.0 * near / ( right - left );
    float y = 2.0 * near / ( top - bottom );
    
    float a = ( right + left ) / ( right - left );
    float b = ( top + bottom ) / ( top - bottom );
    float c = - ( far + near ) / ( far - near );
    float d = - 2.0 * far * near / ( far - near );

    return mat4(
        x,   0.0, 0.0, 0.0,
        0.0, y,   0.0, 0.0,
        a,   b,   c,   -1.0,
        0.0, 0.0, d,   0.0
    );
}