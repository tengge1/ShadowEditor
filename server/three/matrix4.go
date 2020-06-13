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

var _v1Matrix4 = NewVector3(0, 0, 0)
var _m1 = NewMatrix4()
var _zero = NewVector3(0, 0, 0)
var _one = NewVector3(1, 1, 1)
var _x = NewVector3(0, 0, 0)
var _y = NewVector3(0, 0, 0)
var _z = NewVector3(0, 0, 0)

// NewMatrix4 :
func NewMatrix4() *Matrix4 {
	elements := [16]float64{
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	}
	return &Matrix4{elements}
}

// Matrix4 :
type Matrix4 struct {
	Elements [16]float64
}

// Set :
func (m Matrix4) Set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 float64) *Matrix4 {
	te := m.Elements

	te[0] = n11
	te[4] = n12
	te[8] = n13
	te[12] = n14
	te[1] = n21
	te[5] = n22
	te[9] = n23
	te[13] = n24
	te[2] = n31
	te[6] = n32
	te[10] = n33
	te[14] = n34
	te[3] = n41
	te[7] = n42
	te[11] = n43
	te[15] = n44

	return &m
}

// Identity :
func (m Matrix4) Identity() *Matrix4 {
	m.Set(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	)

	return &m
}

// Clone :
func (m Matrix4) Clone() *Matrix4 {
	array := make([]float64, 0)
	for _, elem := range m.Elements {
		array = append(array, elem)
	}
	return NewMatrix4().FromArray(array, 0)
}

// Copy :
func (m Matrix4) Copy(n Matrix4) *Matrix4 {
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
	te[9] = me[9]
	te[10] = me[10]
	te[11] = me[11]
	te[12] = me[12]
	te[13] = me[13]
	te[14] = me[14]
	te[15] = me[15]

	return &m
}

// CopyPosition :
func (m Matrix4) CopyPosition(n Matrix4) *Matrix4 {
	te, me := m.Elements, n.Elements

	te[12] = me[12]
	te[13] = me[13]
	te[14] = me[14]

	return &m
}

// ExtractBasis :
func (m Matrix4) ExtractBasis(xAxis, yAxis, zAxis Vector3) *Matrix4 {
	xAxis.SetFromMatrixColumn(m, 0)
	yAxis.SetFromMatrixColumn(m, 1)
	zAxis.SetFromMatrixColumn(m, 2)

	return &m
}

// MakeBasis :
func (m Matrix4) MakeBasis(xAxis, yAxis, zAxis Vector3) *Matrix4 {
	m.Set(
		xAxis.X, yAxis.X, zAxis.X, 0,
		xAxis.Y, yAxis.Y, zAxis.Y, 0,
		xAxis.Z, yAxis.Z, zAxis.Z, 0,
		0, 0, 0, 1,
	)

	return &m
}

// ExtractRotation :
func (m Matrix4) ExtractRotation(n Matrix4) *Matrix4 {
	// m method does not support reflection matrices
	te := m.Elements
	me := n.Elements

	scaleX := 1 / _v1Matrix4.SetFromMatrixColumn(n, 0).Length()
	scaleY := 1 / _v1Matrix4.SetFromMatrixColumn(n, 1).Length()
	scaleZ := 1 / _v1Matrix4.SetFromMatrixColumn(n, 2).Length()

	te[0] = me[0] * scaleX
	te[1] = me[1] * scaleX
	te[2] = me[2] * scaleX
	te[3] = 0

	te[4] = me[4] * scaleY
	te[5] = me[5] * scaleY
	te[6] = me[6] * scaleY
	te[7] = 0

	te[8] = me[8] * scaleZ
	te[9] = me[9] * scaleZ
	te[10] = me[10] * scaleZ
	te[11] = 0

	te[12] = 0
	te[13] = 0
	te[14] = 0
	te[15] = 1

	return &m
}

// MakeRotationFromEuler :
func (m Matrix4) MakeRotationFromEuler(euler Euler) *Matrix4 {
	te := m.Elements

	x, y, z := euler.X(), euler.Y(), euler.Z()
	a, b := math.Cos(x), math.Sin(x)
	c, d := math.Cos(y), math.Sin(y)
	e, f := math.Cos(z), math.Sin(z)

	if euler._order == "XYZ" {
		ae, af, be, bf := a*e, a*f, b*e, b*f

		te[0] = c * e
		te[4] = -c * f
		te[8] = d

		te[1] = af + be*d
		te[5] = ae - bf*d
		te[9] = -b * c

		te[2] = bf - ae*d
		te[6] = be + af*d
		te[10] = a * c
	} else if euler._order == "YXZ" {
		ce, cf, de, df := c*e, c*f, d*e, d*f

		te[0] = ce + df*b
		te[4] = de*b - cf
		te[8] = a * d

		te[1] = a * f
		te[5] = a * e
		te[9] = -b

		te[2] = cf*b - de
		te[6] = df + ce*b
		te[10] = a * c
	} else if euler._order == "ZXY" {
		ce, cf, de, df := c*e, c*f, d*e, d*f

		te[0] = ce - df*b
		te[4] = -a * f
		te[8] = de + cf*b

		te[1] = cf + de*b
		te[5] = a * e
		te[9] = df - ce*b

		te[2] = -a * d
		te[6] = b
		te[10] = a * c
	} else if euler._order == "ZYX" {
		ae, af, be, bf := a*e, a*f, b*e, b*f

		te[0] = c * e
		te[4] = be*d - af
		te[8] = ae*d + bf

		te[1] = c * f
		te[5] = bf*d + ae
		te[9] = af*d - be

		te[2] = -d
		te[6] = b * c
		te[10] = a * c
	} else if euler._order == "YZX" {
		ac, ad, bc, bd := a*c, a*d, b*c, b*d

		te[0] = c * e
		te[4] = bd - ac*f
		te[8] = bc*f + ad

		te[1] = f
		te[5] = a * e
		te[9] = -b * e

		te[2] = -d * e
		te[6] = ad*f + bc
		te[10] = ac - bd*f
	} else if euler._order == "XZY" {
		ac, ad, bc, bd := a*c, a*d, b*c, b*d

		te[0] = c * e
		te[4] = -f
		te[8] = d * e

		te[1] = ac*f + bd
		te[5] = a * e
		te[9] = ad*f - bc

		te[2] = bc*f - ad
		te[6] = b * e
		te[10] = bd*f + ac
	}

	// bottom row
	te[3] = 0
	te[7] = 0
	te[11] = 0

	// last column
	te[12] = 0
	te[13] = 0
	te[14] = 0
	te[15] = 1

	return &m
}

// MakeRotationFromQuaternion :
func (m Matrix4) MakeRotationFromQuaternion(q Quaternion) *Matrix4 {
	return m.Compose(*_zero, q, *_one)
}

// LookAt :
func (m Matrix4) LookAt(eye, target, up Vector3) *Matrix4 {
	te := m.Elements

	_z.SubVectors(eye, target)

	if _z.LengthSq() == 0 {
		// eye and target are in the same position
		_z.Z = 1
	}

	_z.Normalize()
	_x.CrossVectors(up, *_z)

	if _x.LengthSq() == 0 {
		// up and z are parallel
		if math.Abs(up.Z) == 1 {
			_z.X += 0.0001
		} else {
			_z.Z += 0.0001
		}

		_z.Normalize()
		_x.CrossVectors(up, *_z)
	}

	_x.Normalize()
	_y.CrossVectors(*_z, *_x)

	te[0] = _x.X
	te[4] = _y.X
	te[8] = _z.X
	te[1] = _x.Y
	te[5] = _y.Y
	te[9] = _z.Y
	te[2] = _x.Z
	te[6] = _y.Z
	te[10] = _z.Z

	return &m
}

// Multiply :
func (m Matrix4) Multiply(n Matrix4) *Matrix4 {
	return m.MultiplyMatrices(m, n)
}

// Premultiply :
func (m Matrix4) Premultiply(n Matrix4) *Matrix4 {
	return m.MultiplyMatrices(n, m)
}

// MultiplyMatrices :
func (m Matrix4) MultiplyMatrices(a, b Matrix4) *Matrix4 {
	ae := a.Elements
	be := b.Elements
	te := m.Elements

	a11, a12, a13, a14 := ae[0], ae[4], ae[8], ae[12]
	a21, a22, a23, a24 := ae[1], ae[5], ae[9], ae[13]
	a31, a32, a33, a34 := ae[2], ae[6], ae[10], ae[14]
	a41, a42, a43, a44 := ae[3], ae[7], ae[11], ae[15]

	b11, b12, b13, b14 := be[0], be[4], be[8], be[12]
	b21, b22, b23, b24 := be[1], be[5], be[9], be[13]
	b31, b32, b33, b34 := be[2], be[6], be[10], be[14]
	b41, b42, b43, b44 := be[3], be[7], be[11], be[15]

	te[0] = a11*b11 + a12*b21 + a13*b31 + a14*b41
	te[4] = a11*b12 + a12*b22 + a13*b32 + a14*b42
	te[8] = a11*b13 + a12*b23 + a13*b33 + a14*b43
	te[12] = a11*b14 + a12*b24 + a13*b34 + a14*b44

	te[1] = a21*b11 + a22*b21 + a23*b31 + a24*b41
	te[5] = a21*b12 + a22*b22 + a23*b32 + a24*b42
	te[9] = a21*b13 + a22*b23 + a23*b33 + a24*b43
	te[13] = a21*b14 + a22*b24 + a23*b34 + a24*b44

	te[2] = a31*b11 + a32*b21 + a33*b31 + a34*b41
	te[6] = a31*b12 + a32*b22 + a33*b32 + a34*b42
	te[10] = a31*b13 + a32*b23 + a33*b33 + a34*b43
	te[14] = a31*b14 + a32*b24 + a33*b34 + a34*b44

	te[3] = a41*b11 + a42*b21 + a43*b31 + a44*b41
	te[7] = a41*b12 + a42*b22 + a43*b32 + a44*b42
	te[11] = a41*b13 + a42*b23 + a43*b33 + a44*b43
	te[15] = a41*b14 + a42*b24 + a43*b34 + a44*b44

	return &m
}

// MultiplyScalar :
func (m Matrix4) MultiplyScalar(s float64) *Matrix4 {
	te := m.Elements

	te[0] *= s
	te[4] *= s
	te[8] *= s
	te[12] *= s
	te[1] *= s
	te[5] *= s
	te[9] *= s
	te[13] *= s
	te[2] *= s
	te[6] *= s
	te[10] *= s
	te[14] *= s
	te[3] *= s
	te[7] *= s
	te[11] *= s
	te[15] *= s

	return &m
}

// Determinant :
func (m Matrix4) Determinant() float64 {
	te := m.Elements

	n11, n12, n13, n14 := te[0], te[4], te[8], te[12]
	n21, n22, n23, n24 := te[1], te[5], te[9], te[13]
	n31, n32, n33, n34 := te[2], te[6], te[10], te[14]
	n41, n42, n43, n44 := te[3], te[7], te[11], te[15]

	//TODO: make m more efficient
	//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )
	return (n41*(n14*n23*n32-
		n13*n24*n32-
		n14*n22*n33+
		n12*n24*n33+
		n13*n22*n34-
		n12*n23*n34) +
		n42*(n11*n23*n34-
			n11*n24*n33+
			n14*n21*n33-
			n13*n21*n34+
			n13*n24*n31-
			n14*n23*n31) +
		n43*(n11*n24*n32-
			n11*n22*n34-
			n14*n21*n32+
			n12*n21*n34+
			n14*n22*n31-
			n12*n24*n31) +
		n44*(-n13*n22*n31-
			n11*n23*n32+
			n11*n22*n33+
			n13*n21*n32-
			n12*n21*n33+
			n12*n23*n31))
}

// Transpose :
func (m Matrix4) Transpose() *Matrix4 {
	te := m.Elements
	var tmp float64

	tmp = te[1]
	te[1] = te[4]
	te[4] = tmp
	tmp = te[2]
	te[2] = te[8]
	te[8] = tmp
	tmp = te[6]
	te[6] = te[9]
	te[9] = tmp

	tmp = te[3]
	te[3] = te[12]
	te[12] = tmp
	tmp = te[7]
	te[7] = te[13]
	te[13] = tmp
	tmp = te[11]
	te[11] = te[14]
	te[14] = tmp

	return &m
}

// SetPosition :
func (m Matrix4) SetPosition(x, y, z float64) *Matrix4 {
	te := m.Elements

	te[12] = x
	te[13] = y
	te[14] = z

	return &m
}

// GetInverse :
func (m Matrix4) GetInverse(n Matrix4) *Matrix4 {
	// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
	te := m.Elements
	me := n.Elements

	n11, n21, n31, n41 := me[0], me[1], me[2], me[3]
	n12, n22, n32, n42 := me[4], me[5], me[6], me[7]
	n13, n23, n33, n43 := me[8], me[9], me[10], me[11]
	n14, n24, n34, n44 := me[12], me[13], me[14], me[15]

	t11 := n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44
	t12 := n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44
	t13 := n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44
	t14 := n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34

	det := n11*t11 + n21*t12 + n31*t13 + n41*t14

	if det == 0 {
		return m.Set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
	}

	detInv := 1 / det

	te[0] = t11 * detInv
	te[1] = (n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44) * detInv
	te[2] = (n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44) * detInv
	te[3] = (n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43) * detInv

	te[4] = t12 * detInv
	te[5] = (n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44) * detInv
	te[6] = (n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44) * detInv
	te[7] = (n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43) * detInv

	te[8] = t13 * detInv
	te[9] = (n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44) * detInv
	te[10] = (n12*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44) * detInv
	te[11] = (n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43) * detInv

	te[12] = t14 * detInv
	te[13] = (n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34) * detInv
	te[14] = (n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34) * detInv
	te[15] = (n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33) * detInv

	return &m
}

// Scale :
func (m Matrix4) Scale(v Vector3) *Matrix4 {
	te := m.Elements
	x, y, z := v.X, v.Y, v.Z

	te[0] *= x
	te[4] *= y
	te[8] *= z
	te[1] *= x
	te[5] *= y
	te[9] *= z
	te[2] *= x
	te[6] *= y
	te[10] *= z
	te[3] *= x
	te[7] *= y
	te[11] *= z

	return &m
}

// GetMaxScaleOnAxis :
func (m Matrix4) GetMaxScaleOnAxis() float64 {
	te := m.Elements

	scaleXSq := te[0]*te[0] + te[1]*te[1] + te[2]*te[2]
	scaleYSq := te[4]*te[4] + te[5]*te[5] + te[6]*te[6]
	scaleZSq := te[8]*te[8] + te[9]*te[9] + te[10]*te[10]

	return math.Sqrt(math.Max(math.Max(scaleXSq, scaleYSq), scaleZSq))
}

// MakeTranslation :
func (m Matrix4) MakeTranslation(x, y, z float64) *Matrix4 {
	m.Set(
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1,
	)

	return &m
}

// MakeRotationX :
func (m Matrix4) MakeRotationX(theta float64) *Matrix4 {
	c, s := math.Cos(theta), math.Sin(theta)

	m.Set(
		1, 0, 0, 0,
		0, c, -s, 0,
		0, s, c, 0,
		0, 0, 0, 1,
	)

	return &m
}

// MakeRotationY :
func (m Matrix4) MakeRotationY(theta float64) *Matrix4 {
	c, s := math.Cos(theta), math.Sin(theta)

	m.Set(
		c, 0, s, 0,
		0, 1, 0, 0,
		-s, 0, c, 0,
		0, 0, 0, 1,
	)

	return &m
}

// MakeRotationZ :
func (m Matrix4) MakeRotationZ(theta float64) *Matrix4 {
	c, s := math.Cos(theta), math.Sin(theta)

	m.Set(
		c, -s, 0, 0,
		s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	)

	return &m
}

// MakeRotationAxis :
func (m Matrix4) MakeRotationAxis(axis Vector3, angle float64) *Matrix4 {
	// Based on http://www.gamedev.net/reference/articles/article1199.asp
	c := math.Cos(angle)
	s := math.Sin(angle)
	t := 1 - c
	x, y, z := axis.X, axis.Y, axis.Z
	tx, ty := t*x, t*y

	m.Set(
		tx*x+c, tx*y-s*z, tx*z+s*y, 0,
		tx*y+s*z, ty*y+c, ty*z-s*x, 0,
		tx*z-s*y, ty*z+s*x, t*z*z+c, 0,
		0, 0, 0, 1,
	)

	return &m
}

// MakeScale :
func (m Matrix4) MakeScale(x, y, z float64) *Matrix4 {
	m.Set(
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1,
	)

	return &m
}

// MakeShear :
func (m Matrix4) MakeShear(x, y, z float64) *Matrix4 {
	m.Set(
		1, y, z, 0,
		x, 1, z, 0,
		x, y, 1, 0,
		0, 0, 0, 1,
	)

	return &m
}

// Compose :
func (m Matrix4) Compose(position Vector3, quaternion Quaternion, scale Vector3) *Matrix4 {
	te := m.Elements

	x, y, z, w := quaternion._x, quaternion._y, quaternion._z, quaternion._w
	x2, y2, z2 := x+x, y+y, z+z
	xx, xy, xz := x*x2, x*y2, x*z2
	yy, yz, zz := y*y2, y*z2, z*z2
	wx, wy, wz := w*x2, w*y2, w*z2

	sx, sy, sz := scale.X, scale.Y, scale.Z

	te[0] = (1 - (yy + zz)) * sx
	te[1] = (xy + wz) * sx
	te[2] = (xz - wy) * sx
	te[3] = 0

	te[4] = (xy - wz) * sy
	te[5] = (1 - (xx + zz)) * sy
	te[6] = (yz + wx) * sy
	te[7] = 0

	te[8] = (xz + wy) * sz
	te[9] = (yz - wx) * sz
	te[10] = (1 - (xx + yy)) * sz
	te[11] = 0

	te[12] = position.X
	te[13] = position.Y
	te[14] = position.Z
	te[15] = 1

	return &m
}

// Decompose :
func (m Matrix4) Decompose(position Vector3, quaternion Quaternion, scale Vector3) *Matrix4 {
	te := m.Elements

	sx := _v1Matrix4.Set(te[0], te[1], te[2]).Length()
	sy := _v1Matrix4.Set(te[4], te[5], te[6]).Length()
	sz := _v1Matrix4.Set(te[8], te[9], te[10]).Length()

	// if determine is negative, we need to invert one scale
	det := m.Determinant()
	if det < 0 {
		sx = -sx
	}

	position.X = te[12]
	position.Y = te[13]
	position.Z = te[14]

	// scale the rotation part
	_m1.Copy(m)

	invSX := 1 / sx
	invSY := 1 / sy
	invSZ := 1 / sz

	_m1.Elements[0] *= invSX
	_m1.Elements[1] *= invSX
	_m1.Elements[2] *= invSX

	_m1.Elements[4] *= invSY
	_m1.Elements[5] *= invSY
	_m1.Elements[6] *= invSY

	_m1.Elements[8] *= invSZ
	_m1.Elements[9] *= invSZ
	_m1.Elements[10] *= invSZ

	quaternion.SetFromRotationMatrix(*_m1)

	scale.X = sx
	scale.Y = sy
	scale.Z = sz

	return &m
}

// MakePerspective :
func (m Matrix4) MakePerspective(left, right, top, bottom, near, far float64) *Matrix4 {
	te := m.Elements
	x := 2 * near / (right - left)
	y := 2 * near / (top - bottom)

	a := (right + left) / (right - left)
	b := (top + bottom) / (top - bottom)
	c := -(far + near) / (far - near)
	d := -2 * far * near / (far - near)

	te[0] = x
	te[4] = 0
	te[8] = a
	te[12] = 0
	te[1] = 0
	te[5] = y
	te[9] = b
	te[13] = 0
	te[2] = 0
	te[6] = 0
	te[10] = c
	te[14] = d
	te[3] = 0
	te[7] = 0
	te[11] = -1
	te[15] = 0

	return &m
}

// MakeOrthographic :
func (m Matrix4) MakeOrthographic(left, right, top, bottom, near, far float64) *Matrix4 {
	te := m.Elements
	w := 1.0 / (right - left)
	h := 1.0 / (top - bottom)
	p := 1.0 / (far - near)

	x := (right + left) * w
	y := (top + bottom) * h
	z := (far + near) * p

	te[0] = 2 * w
	te[4] = 0
	te[8] = 0
	te[12] = -x
	te[1] = 0
	te[5] = 2 * h
	te[9] = 0
	te[13] = -y
	te[2] = 0
	te[6] = 0
	te[10] = -2 * p
	te[14] = -z
	te[3] = 0
	te[7] = 0
	te[11] = 0
	te[15] = 1

	return &m
}

// Equals :
func (m Matrix4) Equals(matrix Matrix4) bool {
	te := m.Elements
	me := matrix.Elements

	for i := 0; i < 16; i++ {
		if te[i] != me[i] {
			return false
		}
	}

	return true
}

// FromArray :
func (m Matrix4) FromArray(array []float64, offset int) *Matrix4 {
	if len(array) < offset+16 {
		panic("array length should be greater than offset+16")
	}
	for i := 0; i < 16; i++ {
		m.Elements[i] = array[i+offset]
	}
	return &m
}

// ToArray :
func (m Matrix4) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+16 {
		panic("array length should be greater than offset+16")
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
	array[offset+9] = te[9]
	array[offset+10] = te[10]
	array[offset+11] = te[11]
	array[offset+12] = te[12]
	array[offset+13] = te[13]
	array[offset+14] = te[14]
	array[offset+15] = te[15]
	return array
}
