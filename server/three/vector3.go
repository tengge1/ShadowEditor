// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// this package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

import (
	"math"
	"math/rand"
	"strconv"
)

// NewVector3 :
func NewVector3(x, y, z float64) *Vector3 {
	return &Vector3{x, y, z, true}
}

// Vector3 :
type Vector3 struct {
	X         float64
	Y         float64
	Z         float64
	IsVector3 bool
}

var _vector3 = NewVector3(0, 0, 0)
var _quaternionV3 = NewQuaternion(0, 0, 0, 1)

// Set :
func (v Vector3) Set(x, y, z float64) *Vector3 {
	v.X = x
	v.Y = y
	v.Z = z

	return &v
}

// SetScalar :
func (v Vector3) SetScalar(scalar float64) *Vector3 {
	v.X = scalar
	v.Y = scalar
	v.Z = scalar

	return &v
}

// SetX :
func (v Vector3) SetX(x float64) *Vector3 {
	v.X = x

	return &v
}

// SetY :
func (v Vector3) SetY(y float64) *Vector3 {
	v.Y = y

	return &v
}

// SetZ :
func (v Vector3) SetZ(z float64) *Vector3 {
	v.Z = z

	return &v
}

// SetComponent :
func (v Vector3) SetComponent(index int, value float64) *Vector3 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		v.X = value
	case 1:
		v.Y = value
	case 2:
		v.Z = value
	}

	return &v
}

// GetComponent :
func (v Vector3) GetComponent(index int) float64 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		return v.X
	case 1:
		return v.Y
	case 2:
		return v.Z
	}
}

// Clone :
func (v Vector3) Clone() *Vector3 {
	return NewVector3(v.X, v.Y, v.Z)
}

// Copy :
func (v Vector3) Copy(w Vector3) *Vector3 {
	v.X = w.X
	v.Y = w.Y
	v.Z = w.Z

	return &v
}

// Add :
func (v Vector3) Add(w Vector3) *Vector3 {
	v.X += w.X
	v.Y += w.Y
	v.Z += w.Z

	return &v
}

// AddScalar :
func (v Vector3) AddScalar(s float64) *Vector3 {
	v.X += s
	v.Y += s
	v.Z += s

	return &v
}

// AddVectors :
func (v Vector3) AddVectors(a, b Vector3) *Vector3 {
	v.X = a.X + b.X
	v.Y = a.Y + b.Y
	v.Z = a.Z + b.Z

	return &v
}

// AddScaledVector :
func (v Vector3) AddScaledVector(w Vector3, s float64) *Vector3 {
	v.X += w.X * s
	v.Y += w.Y * s
	v.Z += w.Z * s

	return &v
}

// Sub :
func (v Vector3) Sub(w Vector3) *Vector3 {
	v.X -= w.X
	v.Y -= w.Y
	v.Z -= w.Z

	return &v
}

// SubScalar :
func (v Vector3) SubScalar(s float64) *Vector3 {
	v.X -= s
	v.Y -= s
	v.Z -= s

	return &v
}

// SubVectors :
func (v Vector3) SubVectors(a, b Vector3) *Vector3 {
	v.X = a.X - b.X
	v.Y = a.Y - b.Y
	v.Z = a.Z - b.Z

	return &v
}

// Multiply :
func (v Vector3) Multiply(w Vector3) *Vector3 {
	v.X *= w.X
	v.Y *= w.Y
	v.Z *= w.Z

	return &v
}

// MultiplyScalar :
func (v Vector3) MultiplyScalar(scalar float64) *Vector3 {
	v.X *= scalar
	v.Y *= scalar
	v.Z *= scalar

	return &v
}

// MultiplyVectors :
func (v Vector3) MultiplyVectors(a, b Vector3) *Vector3 {
	v.X = a.X * b.X
	v.Y = a.Y * b.Y
	v.Z = a.Z * b.Z

	return &v
}

// ApplyEuler :
func (v Vector3) ApplyEuler(euler Euler) *Vector3 {
	return v.ApplyQuaternion(*_quaternionV3.SetFromEuler(euler, true))
}

// ApplyAxisAngle :
func (v Vector3) ApplyAxisAngle(axis Vector3, angle float64) *Vector3 {
	return v.ApplyQuaternion(*_quaternionV3.SetFromAxisAngle(axis, angle))
}

// ApplyMatrix3 :
func (v Vector3) ApplyMatrix3(m Matrix3) *Vector3 {
	x, y, z := v.X, v.Y, v.Z
	me := m.Elements

	v.X = me[0]*x + me[3]*y + me[6]*z
	v.Y = me[1]*x + me[4]*y + me[7]*z
	v.Z = me[2]*x + me[5]*y + me[8]*z

	return &v
}

// ApplyNormalMatrix :
func (v Vector3) ApplyNormalMatrix(m Matrix3) *Vector3 {
	return v.ApplyMatrix3(m).Normalize()
}

// ApplyMatrix4 :
func (v Vector3) ApplyMatrix4(m Matrix4) *Vector3 {
	x, y, z := v.X, v.Y, v.Z
	e := m.Elements

	w := 1 / (e[3]*x + e[7]*y + e[11]*z + e[15])

	v.X = (e[0]*x + e[4]*y + e[8]*z + e[12]) * w
	v.Y = (e[1]*x + e[5]*y + e[9]*z + e[13]) * w
	v.Z = (e[2]*x + e[6]*y + e[10]*z + e[14]) * w

	return &v
}

// ApplyQuaternion :
func (v Vector3) ApplyQuaternion(q Quaternion) *Vector3 {
	x, y, z := v.X, v.Y, v.Z
	qx, qy, qz, qw := q.X(), q.Y(), q.Z(), q.W()

	// calculate quat * vector

	ix := qw*x + qy*z - qz*y
	iy := qw*y + qz*x - qx*z
	iz := qw*z + qx*y - qy*x
	iw := -qx*x - qy*y - qz*z

	// calculate result * inverse quat

	v.X = ix*qw + iw*-qx + iy*-qz - iz*-qy
	v.Y = iy*qw + iw*-qy + iz*-qx - ix*-qz
	v.Z = iz*qw + iw*-qz + ix*-qy - iy*-qx

	return &v
}

// Project :
func (v Vector3) Project(matrixWorldInverse, projectionMatrix Matrix4) *Vector3 {
	return v.ApplyMatrix4(matrixWorldInverse).ApplyMatrix4(projectionMatrix)
}

// Unproject :
func (v Vector3) Unproject(projectionMatrixInverse, matrixWorld Matrix4) *Vector3 {
	return v.ApplyMatrix4(projectionMatrixInverse).ApplyMatrix4(matrixWorld)
}

// TransformDirection :
func (v Vector3) TransformDirection(m Matrix4) *Vector3 {
	// input: THREE.Matrix4 affine matrix
	// vector interpreted as a direction

	x, y, z := v.X, v.Y, v.Z
	e := m.Elements

	v.X = e[0]*x + e[4]*y + e[8]*z
	v.Y = e[1]*x + e[5]*y + e[9]*z
	v.Z = e[2]*x + e[6]*y + e[10]*z

	return v.Normalize()
}

// Divide :
func (v Vector3) Divide(w Vector3) *Vector3 {
	v.X /= w.X
	v.Y /= w.Y
	v.Z /= w.Z

	return &v
}

// DivideScalar :
func (v Vector3) DivideScalar(scalar float64) *Vector3 {
	return v.MultiplyScalar(1 / scalar)
}

// Min :
func (v Vector3) Min(w Vector3) *Vector3 {
	v.X = math.Min(v.X, w.X)
	v.Y = math.Min(v.Y, w.Y)
	v.Z = math.Min(v.Z, w.Z)

	return &v
}

// Max :
func (v Vector3) Max(w Vector3) *Vector3 {
	v.X = math.Max(v.X, w.X)
	v.Y = math.Max(v.Y, w.Y)
	v.Z = math.Max(v.Z, w.Z)

	return &v
}

// Clamp :
func (v Vector3) Clamp(min, max Vector3) *Vector3 {
	// assumes min < max, componentwise

	v.X = math.Max(min.X, math.Min(max.X, v.X))
	v.Y = math.Max(min.Y, math.Min(max.Y, v.Y))
	v.Z = math.Max(min.Z, math.Min(max.Z, v.Z))

	return &v
}

// ClampScalar :
func (v Vector3) ClampScalar(minVal, maxVal float64) *Vector3 {
	v.X = math.Max(minVal, math.Min(maxVal, v.X))
	v.Y = math.Max(minVal, math.Min(maxVal, v.Y))
	v.Z = math.Max(minVal, math.Min(maxVal, v.Z))

	return &v
}

// ClampLength :
func (v Vector3) ClampLength(min, max float64) *Vector3 {
	length := v.Length()
	if length == 0 {
		length = 1
	}

	return v.DivideScalar(length).MultiplyScalar(math.Max(min, math.Min(max, length)))
}

// Floor :
func (v Vector3) Floor() *Vector3 {
	v.X = math.Floor(v.X)
	v.Y = math.Floor(v.Y)
	v.Z = math.Floor(v.Z)

	return &v
}

// Ceil :
func (v Vector3) Ceil() *Vector3 {
	v.X = math.Ceil(v.X)
	v.Y = math.Ceil(v.Y)
	v.Z = math.Ceil(v.Z)

	return &v
}

// Round :
func (v Vector3) Round() *Vector3 {
	v.X = math.Round(v.X)
	v.Y = math.Round(v.Y)
	v.Z = math.Round(v.Z)

	return &v
}

// RoundToZero :
func (v Vector3) RoundToZero() *Vector3 {
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

	return &v
}

// Negate ：
func (v Vector3) Negate() *Vector3 {
	v.X = -v.X
	v.Y = -v.Y
	v.Z = -v.Z

	return &v
}

// Dot ：
func (v Vector3) Dot(w Vector3) float64 {
	return v.X*w.X + v.Y*w.Y + v.Z*w.Z
}

// LengthSq ：
func (v Vector3) LengthSq() float64 {
	return v.X*v.X + v.Y*v.Y + v.Z*v.Z
}

// Length ：
func (v Vector3) Length() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y + v.Z*v.Z)
}

// ManhattanLength ：
func (v Vector3) ManhattanLength() float64 {
	return math.Abs(v.X) + math.Abs(v.Y) + math.Abs(v.Z)
}

// Normalize ：
func (v Vector3) Normalize() *Vector3 {
	length := v.Length()
	if length == 0 {
		length = 1
	}
	return v.DivideScalar(length)
}

// SetLength ：
func (v Vector3) SetLength(length float64) *Vector3 {
	return v.Normalize().MultiplyScalar(length)
}

// Lerp :
func (v Vector3) Lerp(w Vector3, alpha float64) *Vector3 {
	v.X += (w.X - v.X) * alpha
	v.Y += (w.Y - v.Y) * alpha
	v.Z += (w.Z - v.Z) * alpha

	return &v
}

// LerpVectors :
func (v Vector3) LerpVectors(v1, v2 Vector3, alpha float64) *Vector3 {
	v.X = v1.X + (v2.X-v1.X)*alpha
	v.Y = v1.Y + (v2.Y-v1.Y)*alpha
	v.Z = v1.Z + (v2.Z-v1.Z)*alpha

	return &v
}

// Cross :
func (v Vector3) Cross(a Vector3) *Vector3 { // bug?
	return v.CrossVectors(v, a)
}

// CrossVectors :
func (v Vector3) CrossVectors(a, b Vector3) *Vector3 {
	ax, ay, az := a.X, a.Y, a.Z
	bx, by, bz := b.X, b.Y, b.Z

	v.X = ay*bz - az*by
	v.Y = az*bx - ax*bz
	v.Z = ax*by - ay*bx

	return &v
}

// ProjectOnVector :
func (v Vector3) ProjectOnVector(w Vector3) *Vector3 {
	denominator := w.LengthSq()

	if denominator == 0 {
		return v.Set(0, 0, 0)
	}

	scalar := w.Dot(v) / denominator

	return v.Copy(w).MultiplyScalar(scalar)
}

// ProjectOnPlane :
func (v Vector3) ProjectOnPlane(planeNormal Vector3) *Vector3 {
	_vector3.Copy(v).ProjectOnVector(planeNormal)

	return v.Sub(*_vector3)
}

// Reflect :
func (v Vector3) Reflect(normal Vector3) *Vector3 {
	// reflect incident vector off plane orthogonal to normal
	// normal is assumed to have unit length

	return v.Sub(*_vector3.Copy(normal).MultiplyScalar(2 * v.Dot(normal)))
}

// AngleTo :
func (v Vector3) AngleTo(w Vector3) float64 {
	denominator := math.Sqrt(w.LengthSq() * w.LengthSq())

	if denominator == 0 {
		return math.Pi / 2
	}

	theta := v.Dot(v) / denominator

	// clamp, to handle numerical problems

	return math.Acos(Clamp(theta, -1, 1))
}

// DistanceTo :
func (v Vector3) DistanceTo(w Vector3) float64 {
	return math.Sqrt(v.DistanceToSquared(w))
}

// DistanceToSquared :
func (v Vector3) DistanceToSquared(w Vector3) float64 {
	dx, dy, dz := v.X-w.X, v.Y-w.Y, v.Z-w.Z

	return dx*dx + dy*dy + dz*dz
}

// ManhattanDistanceTo :
func (v Vector3) ManhattanDistanceTo(w Vector3) float64 {
	return math.Abs(v.X-w.X) + math.Abs(v.Y-w.Y) + math.Abs(v.Z-w.Z)
}

// SetFromSpherical :
func (v Vector3) SetFromSpherical(s Spherical) *Vector3 {
	return v.SetFromSphericalCoords(s.Radius, s.Phi, s.Theta)
}

// SetFromSphericalCoords :
func (v Vector3) SetFromSphericalCoords(radius, phi, theta float64) *Vector3 {
	sinPhiRadius := math.Sin(phi) * radius

	v.X = sinPhiRadius * math.Sin(theta)
	v.Y = math.Cos(phi) * radius
	v.Z = sinPhiRadius * math.Cos(theta)

	return &v
}

// SetFromCylindrical :
func (v Vector3) SetFromCylindrical(c Cylindrical) *Vector3 {
	return v.SetFromCylindricalCoords(c.Radius, c.Theta, c.Y)
}

// SetFromCylindricalCoords :
func (v Vector3) SetFromCylindricalCoords(radius, theta, y float64) *Vector3 {
	v.X = radius * math.Sin(theta)
	v.Y = y
	v.Z = radius * math.Cos(theta)

	return &v
}

// SetFromMatrixPosition :
func (v Vector3) SetFromMatrixPosition(m Matrix4) *Vector3 {
	e := m.Elements

	v.X = e[12]
	v.Y = e[13]
	v.Z = e[14]

	return &v
}

// SetFromMatrixScale :
func (v Vector3) SetFromMatrixScale(m Matrix4) *Vector3 {
	sx := v.SetFromMatrixColumn(m, 0).Length()
	sy := v.SetFromMatrixColumn(m, 1).Length()
	sz := v.SetFromMatrixColumn(m, 2).Length()

	v.X = sx
	v.Y = sy
	v.Z = sz

	return &v
}

// SetFromMatrixColumn :
func (v Vector3) SetFromMatrixColumn(m Matrix4, index int) *Vector3 {
	elems := []float64{}
	for i := 0; i < 3; i++ {
		elems = append(elems, m.Elements[index*4+i])
	}
	return v.FromArray(elems, 0)
}

// SetFromMatrix3Column :
func (v Vector3) SetFromMatrix3Column(m Matrix3, index int) *Vector3 {
	elems := []float64{}
	for i := 0; i < 3; i++ {
		elems = append(elems, m.Elements[index*3+i])
	}
	return v.FromArray(elems, 0)
}

// Equals :
func (v Vector3) Equals(w Vector3) bool {
	return w.X == v.X && w.Y == v.Y && w.Z == v.Z
}

// FromArray :
func (v Vector3) FromArray(array []float64, offset int) *Vector3 {
	if len(array) < offset+3 {
		panic("array length should be greater than offset+3")
	}
	v.X = array[offset]
	v.Y = array[offset+1]
	v.Z = array[offset+2]
	return &v
}

// ToArray :
func (v Vector3) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+3 {
		panic("array length should be greater than offset+3")
	}
	array[offset] = v.X
	array[offset+1] = v.Y
	array[offset+2] = v.Z

	return array
}

// Random :
func (v Vector3) Random() *Vector3 {
	v.X = rand.Float64()
	v.Y = rand.Float64()
	v.Z = rand.Float64()

	return &v
}
