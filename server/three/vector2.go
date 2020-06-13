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

// NewVector2 :
func NewVector2(x, y float64) *Vector2 {
	return &Vector2{x, y, true}
}

// Vector2 :
type Vector2 struct {
	X         float64
	Y         float64
	IsVector2 bool
}

// Width :
func (v Vector2) Width() float64 {
	return v.X
}

// SetWidth :
func (v Vector2) SetWidth(value float64) {
	v.X = value
}

// Height :
func (v Vector2) Height() float64 {
	return v.Y
}

// SetHeight :
func (v Vector2) SetHeight(value float64) {
	v.Y = value
}

// Set :
func (v Vector2) Set(x, y float64) *Vector2 {
	v.X = x
	v.Y = y
	return &v
}

// SetScalar :
func (v Vector2) SetScalar(scalar float64) *Vector2 {
	v.X = scalar
	v.Y = scalar
	return &v
}

// SetX :
func (v Vector2) SetX(x float64) *Vector2 {
	v.X = x
	return &v
}

// SetY :
func (v Vector2) SetY(y float64) *Vector2 {
	v.Y = y
	return &v
}

// SetComponent :
func (v Vector2) SetComponent(index int, value float64) *Vector2 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		v.X = value
	case 1:
		v.Y = value
	}
	return &v
}

// GetComponent :
func (v Vector2) GetComponent(index int) float64 {
	switch index {
	default:
		panic("index is out of range: " + strconv.Itoa(index))
	case 0:
		return v.X
	case 1:
		return v.Y
	}
}

// Clone :
func (v Vector2) Clone() *Vector2 {
	return NewVector2(v.X, v.Y)
}

// Copy :
func (v Vector2) Copy(w Vector2) *Vector2 {
	v.X = w.X
	v.Y = w.Y
	return &v
}

// Add :
func (v Vector2) Add(w Vector2) *Vector2 {
	v.X += w.X
	v.Y += w.Y
	return &v
}

// AddScalar :
func (v Vector2) AddScalar(s float64) *Vector2 {
	v.X += s
	v.Y += s
	return &v
}

// AddVectors :
func (v Vector2) AddVectors(a, b Vector2) *Vector2 {
	v.X = a.X + b.X
	v.Y = a.Y + b.Y
	return &v
}

// AddScaledVector :
func (v Vector2) AddScaledVector(w Vector2, s float64) *Vector2 {
	v.X += w.X * s
	v.Y += w.Y * s
	return &v
}

// Sub :
func (v Vector2) Sub(w Vector2) *Vector2 {
	v.X -= w.X
	v.Y -= w.Y
	return &v
}

// SubScalar :
func (v Vector2) SubScalar(s float64) *Vector2 {
	v.X -= s
	v.Y -= s
	return &v
}

// SubVectors :
func (v Vector2) SubVectors(a, b Vector2) *Vector2 {
	v.X = a.X - b.X
	v.Y = a.Y - b.Y
	return &v
}

// Multiply :
func (v Vector2) Multiply(w Vector2) *Vector2 {
	v.X *= w.X
	v.Y *= w.Y
	return &v
}

// MultiplyScalar :
func (v Vector2) MultiplyScalar(scalar float64) *Vector2 {
	v.X *= scalar
	v.Y *= scalar
	return &v
}

// Divide :
func (v Vector2) Divide(w Vector2) *Vector2 {
	v.X /= w.X
	v.Y /= w.Y
	return &v
}

// DivideScalar :
func (v Vector2) DivideScalar(scalar float64) *Vector2 {
	return v.MultiplyScalar(1 / scalar)
}

// ApplyMatrix3 :
func (v Vector2) ApplyMatrix3(m Matrix3) *Vector2 {
	x, y := v.X, v.Y
	e := m.Elements

	v.X = e[0]*x + e[3]*y + e[6]
	v.Y = e[1]*x + e[4]*y + e[7]

	return &v
}

// Min :
func (v Vector2) Min(w Vector2) *Vector2 {
	v.X = math.Min(v.X, w.X)
	v.Y = math.Min(v.Y, w.Y)

	return &v
}

// Max :
func (v Vector2) Max(w Vector2) *Vector2 {
	v.X = math.Max(v.X, w.X)
	v.Y = math.Max(v.Y, w.Y)

	return &v
}

// Clamp :
func (v Vector2) Clamp(min, max Vector2) *Vector2 {
	// assumes min < max, componentwise
	v.X = math.Max(min.X, math.Min(max.X, v.X))
	v.Y = math.Max(min.Y, math.Min(max.Y, v.Y))

	return &v
}

// ClampScalar :
func (v Vector2) ClampScalar(minVal, maxVal float64) *Vector2 {
	v.X = math.Max(minVal, math.Min(maxVal, v.X))
	v.Y = math.Max(minVal, math.Min(maxVal, v.Y))

	return &v
}

// ClampLength :
func (v Vector2) ClampLength(min, max float64) *Vector2 {
	length := v.Length()
	if length == 0 {
		length = 1
	}

	return v.DivideScalar(length).MultiplyScalar(math.Max(min, math.Min(max, length)))
}

// Floor :
func (v Vector2) Floor() *Vector2 {
	v.X = math.Floor(v.X)
	v.Y = math.Floor(v.Y)

	return &v
}

// Ceil :
func (v Vector2) Ceil() *Vector2 {
	v.X = math.Ceil(v.X)
	v.Y = math.Ceil(v.Y)

	return &v
}

// Round :
func (v Vector2) Round() *Vector2 {
	v.X = math.Round(v.X)
	v.Y = math.Round(v.Y)

	return &v
}

// RoundToZero :
func (v Vector2) RoundToZero() *Vector2 {
	if v.X < 0 {
		v.X = math.Ceil(v.X)
	} else {
		v.X = math.Floor(v.X)
	}

	if v.Y < 0 {
		v.Y = math.Ceil(v.X)
	} else {
		v.Y = math.Floor(v.X)
	}

	return &v
}

// Negate :
func (v Vector2) Negate() *Vector2 {
	v.X = -v.X
	v.Y = -v.Y

	return &v
}

// Dot :
func (v Vector2) Dot(w Vector2) float64 {
	return v.X*w.X + v.Y*w.Y
}

// Cross :
func (v Vector2) Cross(w Vector2) float64 {
	return v.X*w.Y - v.Y*w.X
}

// LengthSq :
func (v Vector2) LengthSq() float64 {
	return v.X*v.X + v.Y*v.Y
}

// Length :
func (v Vector2) Length() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// ManhattanLength :
func (v Vector2) ManhattanLength() float64 {
	return math.Abs(v.X) + math.Abs(v.Y)
}

// Normalize :
func (v Vector2) Normalize() *Vector2 {
	length := v.Length()
	if length == 0 {
		length = 1
	}
	return v.DivideScalar(length)
}

// Angle :
func (v Vector2) Angle() float64 {
	// computes the angle in radians with respect to the positive x-axis
	var angle = math.Atan2(-v.Y, -v.X) + math.Pi

	return angle
}

// DistanceTo :
func (v Vector2) DistanceTo(w Vector2) float64 {
	return math.Sqrt(v.DistanceToSquared(w))
}

// DistanceToSquared :
func (v Vector2) DistanceToSquared(w Vector2) float64 {
	dx, dy := v.X-w.X, v.Y-w.Y
	return dx*dx + dy*dy
}

// ManhattanDistanceTo :
func (v Vector2) ManhattanDistanceTo(w Vector2) float64 {
	return math.Abs(v.X-w.X) + math.Abs(v.Y-w.Y)
}

// SetLength :
func (v Vector2) SetLength(length float64) *Vector2 {
	return v.Normalize().MultiplyScalar(length)
}

// Lerp :
func (v Vector2) Lerp(w Vector2, alpha float64) *Vector2 {
	v.X += (w.X - v.X) * alpha
	v.Y += (w.Y - v.Y) * alpha

	return &v
}

// LerpVectors :
func (v Vector2) LerpVectors(v1, v2 Vector2, alpha float64) *Vector2 {
	v.X = v1.X + (v2.X-v1.X)*alpha
	v.Y = v1.Y + (v2.Y-v1.Y)*alpha

	return &v
}

// Equals :
func (v Vector2) Equals(w Vector2) bool {
	return ((w.X == v.X) && (w.Y == v.Y))
}

// FromArray :
func (v Vector2) FromArray(array []float64, offset int) *Vector2 {
	if len(array) < offset+2 {
		panic("array length should be greater than offset+2")
	}
	v.X = array[offset]
	v.Y = array[offset+1]

	return &v
}

// ToArray :
func (v Vector2) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+2 {
		panic("array length should be greater than offset+2")
	}
	array[offset] = v.X
	array[offset+1] = v.Y
	return array
}

// RotateAround :
func (v Vector2) RotateAround(center Vector2, angle float64) *Vector2 {
	c, s := math.Cos(angle), math.Sin(angle)

	var x = v.X - center.X
	var y = v.Y - center.Y

	v.X = x*c - y*s + center.X
	v.Y = x*s + y*c + center.Y

	return &v
}

// Random :
func (v Vector2) Random() *Vector2 {
	v.X = rand.Float64()
	v.Y = rand.Float64()

	return &v
}
