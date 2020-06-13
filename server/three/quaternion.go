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

const (
	// EPSILON is a small number
	EPSILON = 2.220446049250313e-16
)

type onChangeCallback func()

// NewQuaternion :
func NewQuaternion(x, y, z, w float64) *Quaternion {
	return &Quaternion{x, y, z, w, nil}
}

// Quaternion :
type Quaternion struct {
	_x                float64
	_y                float64
	_z                float64
	_w                float64
	_onChangeCallback onChangeCallback
}

// SlerpQuaternions :
func (q Quaternion) SlerpQuaternions(qa, qb, qm Quaternion, t float64) *Quaternion {
	return qm.Copy(qa).Slerp(qb, t)
}

// SlerpFlat :
func (q Quaternion) SlerpFlat(
	dst []float64, dstOffset int,
	src0 []float64, srcOffset0 int,
	src1 []float64, srcOffset1 int,
	t float64) {
	// fuzz-free, array-based Quaternion SLERP operation
	x0 := src0[srcOffset0+0]
	y0 := src0[srcOffset0+1]
	z0 := src0[srcOffset0+2]
	w0 := src0[srcOffset0+3]

	x1 := src1[srcOffset1+0]
	y1 := src1[srcOffset1+1]
	z1 := src1[srcOffset1+2]
	w1 := src1[srcOffset1+3]

	if w0 != w1 || x0 != x1 || y0 != y1 || z0 != z1 {
		s := 1 - t
		cos := x0*x1 + y0*y1 + z0*z1 + w0*w1
		dir := -1.0
		if cos >= 0 {
			dir = 1.0
		}
		sqrSin := 1 - cos*cos

		// Skip the Slerp for tiny steps to avoid numeric problems:
		// Number.EPSILON :2.220446049250313e-16
		// math.Nextafter(0, 1) 5e-324
		if sqrSin > EPSILON {
			sin := math.Sqrt(sqrSin)
			len := math.Atan2(sin, cos*dir)

			s = math.Sin(s*len) / sin
			t = math.Sin(t*len) / sin
		}

		tDir := t * dir

		x0 := x0*s + x1*tDir
		y0 := y0*s + y1*tDir
		z0 := z0*s + z1*tDir
		w0 := w0*s + w1*tDir

		// Normalize in case we just did a lerp:
		if s == 1-t {
			var f = 1 / math.Sqrt(x0*x0+y0*y0+z0*z0+w0*w0)

			x0 *= f
			y0 *= f
			z0 *= f
			w0 *= f
		}
	}

	dst[dstOffset] = x0
	dst[dstOffset+1] = y0
	dst[dstOffset+2] = z0
	dst[dstOffset+3] = w0
}

// MultiplyQuaternionsFlat :
func (q Quaternion) MultiplyQuaternionsFlat(
	dst []float64, dstOffset int,
	src0 []float64, srcOffset0 int,
	src1 []float64, srcOffset1 int) []float64 {
	x0 := src0[srcOffset0]
	y0 := src0[srcOffset0+1]
	z0 := src0[srcOffset0+2]
	w0 := src0[srcOffset0+3]

	x1 := src1[srcOffset1]
	y1 := src1[srcOffset1+1]
	z1 := src1[srcOffset1+2]
	w1 := src1[srcOffset1+3]

	dst[dstOffset] = x0*w1 + w0*x1 + y0*z1 - z0*y1
	dst[dstOffset+1] = y0*w1 + w0*y1 + z0*x1 - x0*z1
	dst[dstOffset+2] = z0*w1 + w0*z1 + x0*y1 - y0*x1
	dst[dstOffset+3] = w0*w1 - x0*x1 - y0*y1 - z0*z1

	return dst
}

// X :
func (q Quaternion) X() float64 {
	return q._x
}

// SetX :
func (q Quaternion) SetX(val float64) {
	q._x = val
	q._onChangeCallback()
}

// Y :
func (q Quaternion) Y() float64 {
	return q._y
}

// SetY :
func (q Quaternion) SetY(val float64) {
	q._y = val
	q._onChangeCallback()
}

// Z :
func (q Quaternion) Z() float64 {
	return q._z
}

// SetZ :
func (q Quaternion) SetZ(val float64) {
	q._z = val
	q._onChangeCallback()
}

// W :
func (q Quaternion) W() float64 {
	return q._w
}

// SetW :
func (q Quaternion) SetW(val float64) {
	q._w = val
	q._onChangeCallback()
}

// Set :
func (q Quaternion) Set(x, y, z, w float64) *Quaternion {
	q._x = x
	q._y = y
	q._z = z
	q._w = w

	q._onChangeCallback()

	return &q
}

// Clone :
func (q Quaternion) Clone() *Quaternion {
	return NewQuaternion(q._x, q._y, q._z, q._w)
}

// Copy :
func (q Quaternion) Copy(quaternion Quaternion) *Quaternion {
	q._x = quaternion.X()
	q._y = quaternion.Y()
	q._z = quaternion.Z()
	q._w = quaternion.W()

	q._onChangeCallback()

	return &q
}

// SetFromEuler :
func (q Quaternion) SetFromEuler(euler Euler, update bool) *Quaternion {
	x, y, z, order := euler._x, euler._y, euler._z, euler._order

	// http://www.mathworks.com/matlabcentral/fileexchange/
	// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
	//	content/SpinCalc.m
	cos := math.Cos
	sin := math.Sin

	c1 := cos(x / 2)
	c2 := cos(y / 2)
	c3 := cos(z / 2)

	s1 := sin(x / 2)
	s2 := sin(y / 2)
	s3 := sin(z / 2)

	switch order {
	default:
		panic("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + order)
	case "XYZ":
		q._x = s1*c2*c3 + c1*s2*s3
		q._y = c1*s2*c3 - s1*c2*s3
		q._z = c1*c2*s3 + s1*s2*c3
		q._w = c1*c2*c3 - s1*s2*s3
	case "YXZ":
		q._x = s1*c2*c3 + c1*s2*s3
		q._y = c1*s2*c3 - s1*c2*s3
		q._z = c1*c2*s3 - s1*s2*c3
		q._w = c1*c2*c3 + s1*s2*s3
	case "ZXY":
		q._x = s1*c2*c3 - c1*s2*s3
		q._y = c1*s2*c3 + s1*c2*s3
		q._z = c1*c2*s3 + s1*s2*c3
		q._w = c1*c2*c3 - s1*s2*s3
	case "ZYX":
		q._x = s1*c2*c3 - c1*s2*s3
		q._y = c1*s2*c3 + s1*c2*s3
		q._z = c1*c2*s3 - s1*s2*c3
		q._w = c1*c2*c3 + s1*s2*s3
	case "YZX":
		q._x = s1*c2*c3 + c1*s2*s3
		q._y = c1*s2*c3 + s1*c2*s3
		q._z = c1*c2*s3 - s1*s2*c3
		q._w = c1*c2*c3 - s1*s2*s3
	case "XZY":
		q._x = s1*c2*c3 - c1*s2*s3
		q._y = c1*s2*c3 - s1*c2*s3
		q._z = c1*c2*s3 + s1*s2*c3
		q._w = c1*c2*c3 + s1*s2*s3
	}

	if update {
		q._onChangeCallback()
	}

	return &q
}

// SetFromAxisAngle :
func (q Quaternion) SetFromAxisAngle(axis Vector3, angle float64) *Quaternion {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

	// assumes axis is normalized
	halfAngle := angle / 2
	s := math.Sin(halfAngle)

	q._x = axis.X * s
	q._y = axis.Y * s
	q._z = axis.Z * s
	q._w = math.Cos(halfAngle)

	q._onChangeCallback()

	return &q
}

// SetFromRotationMatrix :
func (q Quaternion) SetFromRotationMatrix(m Matrix4) *Quaternion {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	te := m.Elements

	m11, m12, m13 := te[0], te[4], te[8]
	m21, m22, m23 := te[1], te[5], te[9]
	m31, m32, m33 := te[2], te[6], te[10]

	trace := m11 + m22 + m33
	var s float64

	if trace > 0 {
		s = 0.5 / math.Sqrt(trace+1.0)

		q._w = 0.25 / s
		q._x = (m32 - m23) * s
		q._y = (m13 - m31) * s
		q._z = (m21 - m12) * s
	} else if m11 > m22 && m11 > m33 {
		s = 2.0 * math.Sqrt(1.0+m11-m22-m33)

		q._w = (m32 - m23) / s
		q._x = 0.25 * s
		q._y = (m12 + m21) / s
		q._z = (m13 + m31) / s
	} else if m22 > m33 {
		s = 2.0 * math.Sqrt(1.0+m22-m11-m33)

		q._w = (m13 - m31) / s
		q._x = (m12 + m21) / s
		q._y = 0.25 * s
		q._z = (m23 + m32) / s
	} else {
		s = 2.0 * math.Sqrt(1.0+m33-m11-m22)

		q._w = (m21 - m12) / s
		q._x = (m13 + m31) / s
		q._y = (m23 + m32) / s
		q._z = 0.25 * s
	}

	q._onChangeCallback()

	return &q
}

// SetFromUnitVectors :
func (q Quaternion) SetFromUnitVectors(vFrom, vTo Vector3) *Quaternion {
	// assumes direction vectors vFrom and vTo are normalized

	EPS := 0.000001

	r := vFrom.Dot(vTo) + 1

	if r < EPS {
		r = 0

		if math.Abs(vFrom.X) > math.Abs(vFrom.Z) {
			q._x = -vFrom.Y
			q._y = vFrom.X
			q._z = 0
			q._w = r
		} else {
			q._x = 0
			q._y = -vFrom.Z
			q._z = vFrom.Y
			q._w = r
		}
	} else {
		// crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
		q._x = vFrom.Y*vTo.Z - vFrom.Z*vTo.Y
		q._y = vFrom.Z*vTo.X - vFrom.X*vTo.Z
		q._z = vFrom.X*vTo.Y - vFrom.Y*vTo.X
		q._w = r
	}

	return q.Normalize()
}

// AngleTo :
func (q Quaternion) AngleTo(q1 Quaternion) float64 {
	return 2 * math.Acos(math.Abs(Clamp(q.Dot(q1), -1, 1)))
}

// RotateTowards :
func (q Quaternion) RotateTowards(q1 Quaternion, step float64) *Quaternion {
	angle := q.AngleTo(q1)

	if angle == 0 {
		return &q
	}

	t := math.Min(1, step/angle)

	q.Slerp(q1, t)

	return &q
}

// Inverse :
func (q Quaternion) Inverse() *Quaternion {
	// quaternion is assumed to have unit length
	return q.Conjugate()
}

// Conjugate :
func (q Quaternion) Conjugate() *Quaternion {
	q._x *= -1
	q._y *= -1
	q._z *= -1

	q._onChangeCallback()

	return &q
}

// Dot :
func (q Quaternion) Dot(v Quaternion) float64 {
	return q._x*v._x + q._y*v._y + q._z*v._z + q._w*v._w
}

// LengthSq :
func (q Quaternion) LengthSq() float64 {
	return q._x*q._x + q._y*q._y + q._z*q._z + q._w*q._w
}

// Length :
func (q Quaternion) Length() float64 {
	return math.Sqrt(q._x*q._x + q._y*q._y + q._z*q._z + q._w*q._w)
}

// Normalize :
func (q Quaternion) Normalize() *Quaternion {
	l := q.Length()

	if l == 0 {
		q._x = 0
		q._y = 0
		q._z = 0
		q._w = 1
	} else {
		l = 1 / l

		q._x = q._x * l
		q._y = q._y * l
		q._z = q._z * l
		q._w = q._w * l
	}

	q._onChangeCallback()

	return &q
}

// Multiply :
func (q Quaternion) Multiply(q1 Quaternion) *Quaternion {
	return q.MultiplyQuaternions(q, q1)
}

// Premultiply :
func (q Quaternion) Premultiply(q1 Quaternion) *Quaternion {
	return q.MultiplyQuaternions(q1, q)
}

// MultiplyQuaternions :
func (q Quaternion) MultiplyQuaternions(a, b Quaternion) *Quaternion {
	// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
	qax, qay, qaz, qaw := a._x, a._y, a._z, a._w
	qbx, qby, qbz, qbw := b._x, b._y, b._z, b._w

	q._x = qax*qbw + qaw*qbx + qay*qbz - qaz*qby
	q._y = qay*qbw + qaw*qby + qaz*qbx - qax*qbz
	q._z = qaz*qbw + qaw*qbz + qax*qby - qay*qbx
	q._w = qaw*qbw - qax*qbx - qay*qby - qaz*qbz

	q._onChangeCallback()

	return &q
}

// Slerp :
func (q Quaternion) Slerp(qb Quaternion, t float64) *Quaternion {
	if t == 0 {
		return &q
	}
	if t == 1 {
		return q.Copy(qb)
	}

	x, y, z, w := q._x, q._y, q._z, q._w

	// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

	cosHalfTheta := w*qb._w + x*qb._x + y*qb._y + z*qb._z

	if cosHalfTheta < 0 {
		q._w = -qb._w
		q._x = -qb._x
		q._y = -qb._y
		q._z = -qb._z

		cosHalfTheta = -cosHalfTheta
	} else {
		q.Copy(qb)
	}

	if cosHalfTheta >= 1.0 {
		q._w = w
		q._x = x
		q._y = y
		q._z = z

		return &q
	}

	sqrSinHalfTheta := 1.0 - cosHalfTheta*cosHalfTheta

	if sqrSinHalfTheta <= EPSILON {
		var s = 1 - t
		q._w = s*w + t*q._w
		q._x = s*x + t*q._x
		q._y = s*y + t*q._y
		q._z = s*z + t*q._z

		q.Normalize()
		q._onChangeCallback()

		return &q
	}

	sinHalfTheta := math.Sqrt(sqrSinHalfTheta)
	halfTheta := math.Atan2(sinHalfTheta, cosHalfTheta)
	ratioA := math.Sin((1-t)*halfTheta) / sinHalfTheta
	ratioB := math.Sin(t*halfTheta) / sinHalfTheta

	q._w = w*ratioA + q._w*ratioB
	q._x = x*ratioA + q._x*ratioB
	q._y = y*ratioA + q._y*ratioB
	q._z = z*ratioA + q._z*ratioB

	q._onChangeCallback()

	return &q
}

// Equals :
func (q Quaternion) Equals(quaternion Quaternion) bool {
	return quaternion._x == q._x &&
		quaternion._y == q._y && quaternion._z == q._z &&
		quaternion._w == q._w
}

// FromArray :
func (q Quaternion) FromArray(array []float64, offset int) *Quaternion {
	if len(array) < offset+4 {
		panic("array length should be greater than offset+4")
	}
	q._x = array[offset]
	q._y = array[offset+1]
	q._z = array[offset+2]
	q._w = array[offset+3]

	q._onChangeCallback()

	return &q
}

// ToArray :
func (q Quaternion) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+4 {
		panic("array length should be greater than offset+4")
	}
	array[offset] = q._x
	array[offset+1] = q._y
	array[offset+2] = q._z
	array[offset+3] = q._w
	return array
}

// _OnChange :
func (q Quaternion) _OnChange(callback onChangeCallback) *Quaternion {
	q._onChangeCallback = callback

	return &q
}
