/**
 * 计算矩阵行列式的值
 */
float determinant(mat4 te) {
    float n11 = te[0][0], n12 = te[1][0], n13 = te[2][0], n14 = te[3][0];
	float n21 = te[0][1], n22 = te[1][1], n23 = te[2][1], n24 = te[3][1];
	float n31 = te[0][2], n32 = te[1][2], n33 = te[2][2], n34 = te[3][2];
	float n41 = te[0][3], n42 = te[1][3], n43 = te[2][3], n44 = te[3][3];

	//TODO: make this more efficient
	//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
	return (
		n41 * (
			+ n14 * n23 * n32
			 - n13 * n24 * n32
			 - n14 * n22 * n33
			 + n12 * n24 * n33
			 + n13 * n22 * n34
			 - n12 * n23 * n34
		) +
		n42 * (
			+ n11 * n23 * n34
			 - n11 * n24 * n33
			 + n14 * n21 * n33
			 - n13 * n21 * n34
			 + n13 * n24 * n31
			 - n14 * n23 * n31
		) +
		n43 * (
			+ n11 * n24 * n32
			 - n11 * n22 * n34
			 - n14 * n21 * n32
			 + n12 * n21 * n34
			 + n14 * n22 * n31
			 - n12 * n24 * n31
		) +
		n44 * (
			- n13 * n22 * n31
			 - n11 * n23 * n32
			 + n11 * n22 * n33
			 + n13 * n21 * n32
			 - n12 * n21 * n33
			 + n12 * n23 * n31
		)
	);
}