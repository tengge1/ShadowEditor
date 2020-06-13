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

import (
	"math"
	"math/rand"
	"strconv"
)

// NewVector4 :
func NewVector4(x, y, z, w float64) *Vector4 {
	return &Vector4{x, y, z, w}
}

// Vector4 :
type Vector4 struct {
	X float64
	Y float64
	Z float64
	W float64
}

// Width :
func (v Vector4) Width() float64 {
	return v.Z
}

// SetWidth :
func (v Vector4) SetWidth(value float64) *Vector4 {
	v.Z = value
	return &v
}

// Height :
func (v Vector4) Height() float64 {
	return v.W
}

// SetHeight :
func (v Vector4) SetHeight(value float64) *Vector4 {
	v.W = value
	return &v
}

// Set :
func (v Vector4) Set(x, y, z, w float64) *Vector4 {
	v.X = x
	v.Y = y
	v.Z = z
	v.W = w
	return &v
}

// SetScalar :
func (v Vector4) SetScalar(scalar float64) *Vector4 {
	v.X = scalar
	v.Y = scalar
	v.Z = scalar
	v.W = scalar
	return &v
}

// SetX :
func (v Vector4) SetX(x float64) *Vector4 {
	v.X = x
	return &v
}

// SetY :
func (v Vector4) SetY(y float64) *Vector4 {
	v.Y = y
	return &v
}

// SetZ :
func (v Vector4) SetZ(z float64) *Vector4 {
	v.Z = z
	return &v
}

// SetW :
func (v Vector4) SetW(w float64) *Vector4 {
	v.W = w
	return &v
}

// SetComponent :
func (v Vector4) SetComponent(index int, value float64) *Vector4 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		v.X = value
	case 1:
		v.Y = value
	case 2:
		v.Z = value
	case 3:
		v.W = value
	}
	return &v
}

// GetComponent :
func (v Vector4) GetComponent(index int) float64 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		return v.X
	case 1:
		return v.Y
	case 2:
		return v.Z
	case 3:
		return v.W
	}
}

// Clone :
func (v Vector4) Clone() *Vector4 {
	return NewVector4(v.X, v.Y, v.Z, v.W)
}

// Copy :
func (v Vector4) Copy(v1 Vector4) *Vector4 {
	v.X = v1.X
	v.Y = v1.Y
	v.Z = v1.Z
	v.W = v1.W
	return &v
}

// Add :
func (v Vector4) Add(v1 Vector4) *Vector4 {
	v.X += v1.X
	v.Y += v1.Y
	v.Z += v1.Z
	v.W += v1.W
	return &v
}

// AddScalar :
func (v Vector4) AddScalar(s float64) *Vector4 {
	v.X += s
	v.Y += s
	v.Z += s
	v.W += s
	return &v
}

// AddVectors :
func (v Vector4) AddVectors(a, b Vector4) *Vector4 {
	v.X = a.X + b.X
	v.Y = a.Y + b.Y
	v.Z = a.Z + b.Z
	v.W = a.W + b.W
	return &v
}

// AddScaledVector :
func (v Vector4) AddScaledVector(v1 Vector4, s float64) *Vector4 {
	v.X += v1.X * s
	v.Y += v1.Y * s
	v.Z += v1.Z * s
	v.W += v1.W * s
	return &v
}

// Sub :
func (v Vector4) Sub(v1 Vector4) *Vector4 {
	v.X -= v1.X
	v.Y -= v1.Y
	v.Z -= v1.Z
	v.W -= v1.W
	return &v
}

// SubScalar :
func (v Vector4) SubScalar(s float64) *Vector4 {
	v.X -= s
	v.Y -= s
	v.Z -= s
	v.W -= s
	return &v
}

// SubVectors :
func (v Vector4) SubVectors(a, b Vector4) *Vector4 {
	v.X = a.X - b.X
	v.Y = a.Y - b.Y
	v.Z = a.Z - b.Z
	v.W = a.W - b.W
	return &v
}

// MultiplyScalar :
func (v Vector4) MultiplyScalar(scalar float64) *Vector4 {
	v.X *= scalar
	v.Y *= scalar
	v.Z *= scalar
	v.W *= scalar
	return &v
}

// ApplyMatrix4 :
func (v Vector4) ApplyMatrix4(m Matrix4) *Vector4 {
	x, y, z, w := v.X, v.Y, v.Z, v.W
	e := m.Elements

	v.X = e[0]*x + e[4]*y + e[8]*z + e[12]*w
	v.Y = e[1]*x + e[5]*y + e[9]*z + e[13]*w
	v.Z = e[2]*x + e[6]*y + e[10]*z + e[14]*w
	v.W = e[3]*x + e[7]*y + e[11]*z + e[15]*w
	return &v
}

// DivideScalar :
func (v Vector4) DivideScalar(scalar float64) *Vector4 {
	return v.MultiplyScalar(1 / scalar)
}

// SetAxisAngleFromQuaternion :
func (v Vector4) SetAxisAngleFromQuaternion(q Quaternion) *Vector4 {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
	// q is assumed to be normalized
	v.W = 2 * math.Acos(q.W())
	s := math.Sqrt(1 - q.W()*q.W())
	if s < 0.0001 {
		v.X = 1
		v.Y = 0
		v.Z = 0
	} else {
		v.X = q.X() / s
		v.Y = q.Y() / s
		v.Z = q.Z() / s
	}
	return &v
}

// SetAxisAngleFromRotationMatrix :
func (v Vector4) SetAxisAngleFromRotationMatrix(m Matrix4) *Vector4 {
	// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	var angle, x, y, z float64 // variables for result
	epsilon := 0.01            // margin to allow for rounding errors
	epsilon2 := 0.1            // margin to distinguish between 0 and 180 degrees
	te := m.Elements

	m11, m12, m13 := te[0], te[4], te[8]
	m21, m22, m23 := te[1], te[5], te[9]
	m31, m32, m33 := te[2], te[6], te[10]

	if (math.Abs(m12-m21) < epsilon) &&
		(math.Abs(m13-m31) < epsilon) &&
		(math.Abs(m23-m32) < epsilon) {
		// singularity found
		// first check for identity matrix which must have +1 for all terms
		// in leading diagonal and zero in other terms
		if (math.Abs(m12+m21) < epsilon2) &&
			(math.Abs(m13+m31) < epsilon2) &&
			(math.Abs(m23+m32) < epsilon2) &&
			(math.Abs(m11+m22+m33-3) < epsilon2) {
			// v singularity is identity matrix so angle = 0
			v.Set(1, 0, 0, 0)
			return &v // zero angle, arbitrary axis
		}
		// otherwise v singularity is angle = 180
		angle = math.Pi
		xx := (m11 + 1) / 2
		yy := (m22 + 1) / 2
		zz := (m33 + 1) / 2
		xy := (m12 + m21) / 4
		xz := (m13 + m31) / 4
		yz := (m23 + m32) / 4
		if (xx > yy) && (xx > zz) {
			// m11 is the largest diagonal term
			if xx < epsilon {
				x = 0
				y = 0.707106781
				z = 0.707106781
			} else {
				x = math.Sqrt(xx)
				y = xy / x
				z = xz / x
			}
		} else if yy > zz {
			// m22 is the largest diagonal term
			if yy < epsilon {
				x = 0.707106781
				y = 0
				z = 0.707106781
			} else {
				y = math.Sqrt(yy)
				x = xy / y
				z = yz / y
			}
		} else {
			// m33 is the largest diagonal term so base result on v
			if zz < epsilon {
				x = 0.707106781
				y = 0.707106781
				z = 0
			} else {
				z = math.Sqrt(zz)
				x = xz / z
				y = yz / z
			}
		}

		v.Set(x, y, z, angle)
		return &v // return 180 deg rotation
	}

	// as we have reached here there are no singularities so we can handle normally
	s := math.Sqrt((m32-m23)*(m32-m23) +
		(m13-m31)*(m13-m31) +
		(m21-m12)*(m21-m12)) // used to normalize

	if math.Abs(s) < 0.001 {
		s = 1
	}
	// prevent divide by zero, should not happen if matrix is orthogonal and should be
	// caught by singularity test above, but I've left it in just in case
	v.X = (m32 - m23) / s
	v.Y = (m13 - m31) / s
	v.Z = (m21 - m12) / s
	v.W = math.Acos((m11 + m22 + m33 - 1) / 2)
	return &v
}

// Min :
func (v Vector4) Min(v1 Vector4) *Vector4 {
	v.X = math.Min(v.X, v1.X)
	v.Y = math.Min(v.Y, v1.Y)
	v.Z = math.Min(v.Z, v1.Z)
	v.W = math.Min(v.W, v1.W)
	return &v
}

// Max :
func (v Vector4) Max(v1 Vector4) *Vector4 {
	v.X = math.Max(v.X, v1.X)
	v.Y = math.Max(v.Y, v1.Y)
	v.Z = math.Max(v.Z, v1.Z)
	v.W = math.Max(v.W, v1.W)
	return &v
}

// Clamp :
func (v Vector4) Clamp(min, max Vector4) *Vector4 {
	// assumes min < max, componentwise
	v.X = math.Max(min.X, math.Min(max.X, v.X))
	v.Y = math.Max(min.Y, math.Min(max.Y, v.Y))
	v.Z = math.Max(min.Z, math.Min(max.Z, v.Z))
	v.W = math.Max(min.W, math.Min(max.W, v.W))
	return &v
}

// ClampScalar :
func (v Vector4) ClampScalar(minVal, maxVal float64) *Vector4 {
	v.X = math.Max(minVal, math.Min(maxVal, v.X))
	v.Y = math.Max(minVal, math.Min(maxVal, v.Y))
	v.Z = math.Max(minVal, math.Min(maxVal, v.Z))
	v.W = math.Max(minVal, math.Min(maxVal, v.W))
	return &v
}

// ClampLength :
func (v Vector4) ClampLength(min, max float64) *Vector4 {
	length := v.Length()
	if length == 0 {
		length = 1
	}
	return v.DivideScalar(length).MultiplyScalar(math.Max(min, math.Min(max, length)))
}

// Floor :
func (v Vector4) Floor() *Vector4 {
	v.X = math.Floor(v.X)
	v.Y = math.Floor(v.Y)
	v.Z = math.Floor(v.Z)
	v.W = math.Floor(v.W)
	return &v
}

// Ceil :
func (v Vector4) Ceil() *Vector4 {
	v.X = math.Ceil(v.X)
	v.Y = math.Ceil(v.Y)
	v.Z = math.Ceil(v.Z)
	v.W = math.Ceil(v.W)
	return &v
}

// Round :
func (v Vector4) Round() *Vector4 {
	v.X = math.Round(v.X)
	v.Y = math.Round(v.Y)
	v.Z = math.Round(v.Z)
	v.W = math.Round(v.W)
	return &v
}

// RoundToZero :
func (v Vector4) RoundToZero() *Vector4 {
	if v.X < 0 {
		v.X = math.Ceil(v.X)
	} else {
		v.X = math.Floor(v.X)
	}
	if v.Y < 0 {
		v.Y = math.Ceil(v.Y)
	} else {
		v.Y = math.Floor(v.Y)
	}
	if v.Z < 0 {
		v.Z = math.Ceil(v.Z)
	} else {
		v.Z = math.Floor(v.Z)
	}
	if v.W < 0 {
		v.W = math.Ceil(v.W)
	} else {
		v.W = math.Floor(v.W)
	}
	return &v
}

// Negate :
func (v Vector4) Negate() *Vector4 {
	v.X = -v.X
	v.Y = -v.Y
	v.Z = -v.Z
	v.W = -v.W
	return &v
}

// Dot :
func (v Vector4) Dot(v1 Vector4) float64 {
	return v.X*v1.X + v.Y*v1.Y + v.Z*v1.Z + v.W*v1.W
}

// LengthSq :
func (v Vector4) LengthSq() float64 {
	return v.X*v.X + v.Y*v.Y + v.Z*v.Z + v.W*v.W
}

// Length :
func (v Vector4) Length() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y + v.Z*v.Z + v.W*v.W)
}

// ManhattanLength :
func (v Vector4) ManhattanLength() float64 {
	return math.Abs(v.X) + math.Abs(v.Y) + math.Abs(v.Z) + math.Abs(v.W)
}

// Normalize :
func (v Vector4) Normalize() *Vector4 {
	length := v.Length()
	if length == 0 {
		length = 1
	}
	return v.DivideScalar(length)
}

// SetLength :
func (v Vector4) SetLength(length float64) *Vector4 {
	return v.Normalize().MultiplyScalar(length)
}

// Lerp :
func (v Vector4) Lerp(v1 Vector4, alpha float64) *Vector4 {
	v.X += (v1.X - v.X) * alpha
	v.Y += (v1.Y - v.Y) * alpha
	v.Z += (v1.Z - v.Z) * alpha
	v.W += (v1.W - v.W) * alpha
	return &v
}

// LerpVectors :
func (v Vector4) LerpVectors(v1, v2 Vector4, alpha float64) *Vector4 {
	v.X = v1.X + (v2.X-v1.X)*alpha
	v.Y = v1.Y + (v2.Y-v1.Y)*alpha
	v.Z = v1.Z + (v2.Z-v1.Z)*alpha
	v.W = v1.W + (v2.W-v1.W)*alpha
	return &v
}

// Equals :
func (v Vector4) Equals(v1 Vector4) bool {
	return ((v1.X == v.X) && (v1.Y == v.Y) && (v1.Z == v.Z) && (v1.W == v.W))
}

// FromArray :
func (v Vector4) FromArray(array []float64, offset int) *Vector4 {
	if len(array) < offset+4 {
		panic("array length should be greater than offset+4")
	}
	v.X = array[offset]
	v.Y = array[offset+1]
	v.Z = array[offset+2]
	v.W = array[offset+3]
	return &v
}

// ToArray :
func (v Vector4) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+4 {
		panic("array length should be greater than offset+4")
	}
	array[offset] = v.X
	array[offset+1] = v.Y
	array[offset+2] = v.Z
	array[offset+3] = v.W
	return array
}

// Random :
func (v Vector4) Random() *Vector4 {
	v.X = rand.Float64()
	v.Y = rand.Float64()
	v.Z = rand.Float64()
	v.W = rand.Float64()
	return &v
}
