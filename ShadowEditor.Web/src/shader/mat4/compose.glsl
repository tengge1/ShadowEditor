/**
 * 平移、旋转、缩放转矩阵
 */
mat4 compose( vec3 position, vec4 quaternion, vec3 scale ) {
	float x = quaternion.x,
          y = quaternion.y,
          z = quaternion.z,
          w = quaternion.w;

	float x2 = x + x,
          y2 = y + y,
          z2 = z + z;

	float xx = x * x2, xy = x * y2, xz = x * z2;
	float yy = y * y2, yz = y * z2, zz = z * z2;
	float wx = w * x2, wy = w * y2, wz = w * z2;
	
    float sx = scale.x, sy = scale.y, sz = scale.z;

    return mat4(
        ( 1.0 - ( yy + zz ) ) * sx,
        ( xy + wz ) * sx,
        ( xz - wy ) * sx,
        0.0,
        ( xy - wz ) * sy,
        ( 1.0 - ( xx + zz ) ) * sy,
        ( yz + wx ) * sy,
        0.0,
        ( xz + wy ) * sz,
        ( yz - wx ) * sz,
        ( 1.0 - ( xx + yy ) ) * sz,
        0.0,
        position.x,
        position.y,
        position.z,
        1.0
    );
}