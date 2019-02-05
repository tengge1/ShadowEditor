#include <determinant>

/**
 * 将矩阵分解为平移、旋转、缩放矩阵
 */
void decomposeMatrix(in mat4 te, out mat4 position, out mat4 rotation, out mat4 scale) {
    float sx = length(vec3(te[0][0], te[0][1], te[0][2]));
    float sy = length(vec3(te[1][0], te[1][1], te[1][2]));
    float sz = length(vec3(te[2][0], te[2][1], te[2][2]));
    
    // if determine is negative, we need to invert one scale
	float det = determinant(te);
    
    if (det < 0.0) sx = -sx;

	position = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		te[3][0], te[3][1], te[3][2], 1.0
	);
    
    // scale the rotation part
    float invSX = 1.0 / sx;
	float invSY = 1.0 / sy;
	float invSZ = 1.0 / sz;

	rotation = mat4(
		te[0][0] * invSX, te[0][1] * invSX, te[0][2] * invSX, 0.0,
		te[1][0] * invSY, te[1][1] * invSY, te[1][2] * invSY, 0.0,
		te[2][0] * invSZ, te[2][1] * invSZ, te[2][2] * invSZ, 0.0,
		0.0,              0.0,              0.0,              1.0
	);
    
	scale = mat4(
		sx, 0.0, 0.0, 0.0,
		0.0, sy, 0.0, 0.0,
		0.0, 0.0, sz, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
}