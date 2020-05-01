#include <makePerspective>

/**
 * 根据视场生成投影矩阵
 */
mat4 makePerspective2(float fov, float aspect, float near, float far) {
    const float DEG2RAD = 0.017453292519943295; // PI / 180

    float top = near * tan( DEG2RAD * 0.5 * fov );
	float height = 2.0 * top;
	float width = aspect * height;
	float left = - 0.5 * width;
    
    return makePerspective(left, left + width, top, top - height, near, far );
}