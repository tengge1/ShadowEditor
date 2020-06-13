// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// This package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

import "math"

// NewMatrix3 :
func NewMatrix3() *Matrix3 {
	elements := [9]float64{
		1, 0, 0,
		0, 1, 0,
		0, 0, 1,
	}
	return &Matrix3{elements}
}

// Matrix3 :
type Matrix3 struct {
	Elements [9]float64
}

// Set :
func (m Matrix3) Set(n11, n12, n13, n21, n22, n23, n31, n32, n33 float64) *Matrix3 {
	te := m.Elements

	te[0] = n11
	te[1] = n21
	te[2] = n31
	te[3] = n12
	te[4] = n22
	te[5] = n32
	te[6] = n13
	te[7] = n23
	te[8] = n33

	return &m
}

// Identity :
func (m Matrix3) Identity() *Matrix3 {
	m.Set(
		1, 0, 0,
		0, 1, 0,
		0, 0, 1,
	)

	return &m
}

// Clone :
func (m Matrix3) Clone() *Matrix3 {
	array := make([]float64, 0)
	for _, elem := range m.Elements {
		array = append(array, elem)
	}
	return NewMatrix3().FromArray(array, 0)
}

// Copy :
func (m Matrix3) Copy(n Matrix3) *Matrix3 {
	te := m.Elements
	me := n.Elements

	te[0] = me[0]
	te[1] = me[1]
	te[2] = me[2]
	te[3] = me[3]
	te[4] = me[4]
	te[5] = me[5]
	te[6] = me[6]
	te[7] = me[7]
	te[8] = me[8]

	return &m
}

// ExtractBasis :
func (m Matrix3) ExtractBasis(xAxis, yAxis, zAxis Vector3) *Matrix3 {
	xAxis.SetFromMatrix3Column(m, 0)
	yAxis.SetFromMatrix3Column(m, 1)
	zAxis.SetFromMatrix3Column(m, 2)

	return &m
}

// SetFromMatrix4 :
func (m Matrix3) SetFromMatrix4(n Matrix4) *Matrix3 {
	me := n.Elements

	m.Set(
		me[0], me[4], me[8],
		me[1], me[5], me[9],
		me[2], me[6], me[10],
	)

	return &m
}

// Multiply :
func (m Matrix3) Multiply(n Matrix3) *Matrix3 {
	return m.MultiplyMatrices(m, n)
}

// Premultiply :
func (m Matrix3) Premultiply(n Matrix3) *Matrix3 {
	return m.MultiplyMatrices(n, m)
}

// MultiplyMatrices :
func (m Matrix3) MultiplyMatrices(a, b Matrix3) *Matrix3 {
	ae := a.Elements
	be := b.Elements
	te := m.Elements

	a11, a12, a13 := ae[0], ae[3], ae[6]
	a21, a22, a23 := ae[1], ae[4], ae[7]
	a31, a32, a33 := ae[2], ae[5], ae[8]

	b11, b12, b13 := be[0], be[3], be[6]
	b21, b22, b23 := be[1], be[4], be[7]
	b31, b32, b33 := be[2], be[5], be[8]

	te[0] = a11*b11 + a12*b21 + a13*b31
	te[3] = a11*b12 + a12*b22 + a13*b32
	te[6] = a11*b13 + a12*b23 + a13*b33

	te[1] = a21*b11 + a22*b21 + a23*b31
	te[4] = a21*b12 + a22*b22 + a23*b32
	te[7] = a21*b13 + a22*b23 + a23*b33

	te[2] = a31*b11 + a32*b21 + a33*b31
	te[5] = a31*b12 + a32*b22 + a33*b32
	te[8] = a31*b13 + a32*b23 + a33*b33

	return &m
}

// MultiplyScalar :
func (m Matrix3) MultiplyScalar(s float64) *Matrix3 {
	te := m.Elements

	te[0] *= s
	te[3] *= s
	te[6] *= s
	te[1] *= s
	te[4] *= s
	te[7] *= s
	te[2] *= s
	te[5] *= s
	te[8] *= s

	return &m
}

// Determinant :
func (m Matrix3) Determinant() float64 {
	te := m.Elements

	a, b, c := te[0], te[1], te[2]
	d, e, f := te[3], te[4], te[5]
	g, h, i := te[6], te[7], te[8]

	return a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g
}

// GetInverse :
func (m Matrix3) GetInverse(matrix Matrix3) *Matrix3 {
	me := matrix.Elements
	te := m.Elements

	n11, n21, n31 := me[0], me[1], me[2]
	n12, n22, n32 := me[3], me[4], me[5]
	n13, n23, n33 := me[6], me[7], me[8]

	t11 := n33*n22 - n32*n23
	t12 := n32*n13 - n33*n12
	t13 := n23*n12 - n22*n13

	det := n11*t11 + n21*t12 + n31*t13

	if det == 0 {
		return m.Set(0, 0, 0, 0, 0, 0, 0, 0, 0)
	}

	detInv := 1 / det

	te[0] = t11 * detInv
	te[1] = (n31*n23 - n33*n21) * detInv
	te[2] = (n32*n21 - n31*n22) * detInv

	te[3] = t12 * detInv
	te[4] = (n33*n11 - n31*n13) * detInv
	te[5] = (n31*n12 - n32*n11) * detInv

	te[6] = t13 * detInv
	te[7] = (n21*n13 - n23*n11) * detInv
	te[8] = (n22*n11 - n21*n12) * detInv

	return &m
}

// Transpose :
func (m Matrix3) Transpose() *Matrix3 {
	te := m.Elements

	tmp := te[1]
	te[1] = te[3]
	te[3] = tmp

	tmp = te[2]
	te[2] = te[6]
	te[6] = tmp

	tmp = te[5]
	te[5] = te[7]
	te[7] = tmp

	return &m
}

// GetNormalMatrix :
func (m Matrix3) GetNormalMatrix(matrix4 Matrix4) *Matrix3 {
	return m.SetFromMatrix4(matrix4).GetInverse(m).Transpose()
}

// TransposeIntoArray :
func (m Matrix3) TransposeIntoArray(r []float64) *Matrix3 {
	if len(r) < 9 {
		panic("array length should be greater than 9")
	}
	te := m.Elements
	r[0] = te[0]
	r[1] = te[3]
	r[2] = te[6]
	r[3] = te[1]
	r[4] = te[4]
	r[5] = te[7]
	r[6] = te[2]
	r[7] = te[5]
	r[8] = te[8]
	return &m
}

// SetUvTransform :
func (m Matrix3) SetUvTransform(tx, ty, sx, sy, rotation, cx, cy float64) *Matrix3 {
	c := math.Cos(rotation)
	s := math.Sin(rotation)

	m.Set(
		sx*c, sx*s, -sx*(c*cx+s*cy)+cx+tx,
		-sy*s, sy*c, -sy*(-s*cx+c*cy)+cy+ty,
		0, 0, 1,
	)
	return &m
}

// Scale :
func (m Matrix3) Scale(sx, sy float64) *Matrix3 {
	var te = m.Elements

	te[0] *= sx
	te[3] *= sx
	te[6] *= sx
	te[1] *= sy
	te[4] *= sy
	te[7] *= sy

	return &m
}

// Rotate :
func (m Matrix3) Rotate(theta float64) *Matrix3 {
	c := math.Cos(theta)
	s := math.Sin(theta)

	te := m.Elements

	a11, a12, a13 := te[0], te[3], te[6]
	a21, a22, a23 := te[1], te[4], te[7]

	te[0] = c*a11 + s*a21
	te[3] = c*a12 + s*a22
	te[6] = c*a13 + s*a23

	te[1] = -s*a11 + c*a21
	te[4] = -s*a12 + c*a22
	te[7] = -s*a13 + c*a23

	return &m
}

// Translate :
func (m Matrix3) Translate(tx, ty float64) *Matrix3 {
	te := m.Elements

	te[0] += tx * te[2]
	te[3] += tx * te[5]
	te[6] += tx * te[8]
	te[1] += ty * te[2]
	te[4] += ty * te[5]
	te[7] += ty * te[8]

	return &m
}

// Equals :
func (m Matrix3) Equals(matrix Matrix3) bool {
	te := m.Elements
	me := matrix.Elements

	for i := 0; i < 9; i++ {
		if te[i] != me[i] {
			return false
		}
	}

	return true
}

// FromArray :
func (m Matrix3) FromArray(array []float64, offset int) *Matrix3 {
	if len(array) < offset+9 {
		panic("array length should be greater than offset+9")
	}
	for i := 0; i < 9; i++ {
		m.Elements[i] = array[i+offset]
	}

	return &m
}

// ToArray :
func (m Matrix3) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+9 {
		panic("array length should be greater than offset+9")
	}
	te := m.Elements
	array[offset] = te[0]
	array[offset+1] = te[1]
	array[offset+2] = te[2]
	array[offset+3] = te[3]
	array[offset+4] = te[4]
	array[offset+5] = te[5]
	array[offset+6] = te[6]
	array[offset+7] = te[7]
	array[offset+8] = te[8]
	return array
}
