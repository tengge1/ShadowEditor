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
	e := m.elements

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
func (v Vector2) ClampLength(min, max float64) float64 {
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
func (v Vector2) Round() {
	this.x = Math.round(this.x)
	this.y = Math.round(this.y)

	return this
}

// RoundToZero :
func (v Vector2) RoundToZero() *Vector2 {
	if v.X < 0 {
		v.X = math.Ceil(this.x)
	} else {
		v.X = math.Floor(this.x)
	}

	if v.Y < 0 {
		v.Y = math.Ceil(this.x)
	} else {
		v.Y = math.Floor(this.x)
	}

	return &v
}

// Negate :
func (v Vector2) Negate() {
	this.x = -this.x
	this.y = -this.y

	return this
}

// Dot :
func (v Vector2) Dot(w Vector2) {
	return this.x*w.x + this.y*w.y
}

// Cross :
func (v Vector2) Cross(w Vector2) {
	return this.x*w.y - this.y*w.x
}

// LengthSq :
func (v Vector2) LengthSq() {
	return this.x*this.x + this.y*this.y
}

// Length :
func (v Vector2) Length() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// ManhattanLength :
func (v Vector2) ManhattanLength() {
	return Math.abs(this.x) + Math.abs(this.y)
}

// Normalize :
func (v Vector2) Normalize() {
	return this.divideScalar(this.length() || 1)
}

// Angle :
func (v Vector2) Angle() {
	// computes the angle in radians with respect to the positive x-axis
	var angle = Math.atan2(-this.y, -this.x) + Math.PI

	return angle
}

// DistanceTo :
func (v Vector2) DistanceTo(w Vector2) {
	return Math.sqrt(this.distanceToSquared(w))
}

// DistanceToSquared :
func (v Vector2) DistanceToSquared(w Vector2) float64 {
	dx, dy := v.X-w.X, v.Y-w.Y
	return dx*dx + dy*dy
}

// ManhattanDistanceTo :
func (v Vector2) ManhattanDistanceTo(w Vector2) {
	return Math.abs(this.x-w.x) + Math.abs(this.y-w.y)
}

// SetLength :
func (v Vector2) SetLength(length float64) {
	return this.normalize().multiplyScalar(length)
}

// Lerp :
func (v Vector2) Lerp(w Vector2, alpha float64) {
	this.x += (w.x - this.x) * alpha
	this.y += (w.y - this.y) * alpha

	return this
}

// LerpVectors :
func (v Vector2) LerpVectors(v1, v2 Vector2, alpha float64) {
	this.x = v1.x + (v2.x-v1.x)*alpha
	this.y = v1.y + (v2.y-v1.y)*alpha

	return this
}

// Equals :
func (v Vector2) Equals(w Vector2) {
	return ((w.x == this.x) && (w.y == this.y))
}

// FromArray :
func (v Vector2) FromArray(array []float64, offset int) {
	this.x = array[offset]
	this.y = array[offset+1]

	return this
}

// ToArray :
func (v Vector2) ToArray(array []float64, offset int) []float64 {
	array[offset] = this.x
	array[offset+1] = this.y

	return array
}

// RotateAround :
func (v Vector2) RotateAround(center Vector2, angle float64) {
	c, s := math.Cos(angle), math.Sin(angle)

	var x = this.x - center.x
	var y = this.y - center.y

	this.x = x*c - y*s + center.x
	this.y = x*s + y*c + center.y

	return this
}

// Random :
func (v Vector2) Random() *Vector2 {
	v.X = math.Random()
	v.Y = math.Random()

	return &v
}
