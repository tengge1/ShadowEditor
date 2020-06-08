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
)

var _vector = NewVector2(0, 0)

// NewBox2 :
func NewBox2(min, max Vector2) *Box2 {
	return &Box2{min, max}
}

// Box2 :
type Box2 struct {
	Min Vector2
	Max Vector2
}

// Set :
func (b Box2) Set(min, max Vector2) *Box2 {
	b.Min.Copy(min)
	b.Max.Copy(max)

	return &b
}

// SetFromPoints :
func (b Box2) SetFromPoints(points []Vector2) *Box2 {
	b.MakeEmpty()

	for i, il := 0, len(points); i < il; i++ {
		b.ExpandByPoint(points[i])
	}

	return &b
}

// SetFromCenterAndSize :
func (b Box2) SetFromCenterAndSize(center, size Vector2) *Box2 {
	halfSize := _vector.Copy(size).MultiplyScalar(0.5)

	b.Min.Copy(center).Sub(*halfSize)
	b.Max.Copy(center).Add(*halfSize)

	return &b
}

// Clone :
func (b Box2) Clone() *Box2 {
	return b.Copy(b)
}

// Copy :
func (b Box2) Copy(box Box2) *Box2 {
	b.Min.Copy(box.Min)
	b.Max.Copy(box.Max)

	return &b
}

// MakeEmpty :
func (b Box2) MakeEmpty() *Box2 {
	b.Min.X, b.Min.Y = math.Inf(1), math.Inf(1)
	b.Max.X, b.Max.Y = math.Inf(-1), math.Inf(-1)

	return &b
}

// IsEmpty :
func (b Box2) IsEmpty() bool {
	// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
	return b.Max.X < b.Min.X || b.Max.Y < b.Min.Y
}

// GetCenter :
func (b Box2) GetCenter(target Vector2) *Vector2 {
	if b.IsEmpty() {
		return target.Set(0, 0)
	}
	return target.AddVectors(b.Min, b.Max).MultiplyScalar(0.5)
}

// GetSize :
func (b Box2) GetSize(target Vector2) *Vector2 {
	if b.IsEmpty() {
		return target.Set(0, 0)
	}
	return target.SubVectors(b.Max, b.Min)
}

// ExpandByPoint :
func (b Box2) ExpandByPoint(point Vector2) *Box2 {
	b.Min.Min(point)
	b.Max.Max(point)

	return &b
}

// ExpandByVector :
func (b Box2) ExpandByVector(vector Vector2) *Box2 {
	b.Min.Sub(vector)
	b.Max.Add(vector)

	return &b
}

// ExpandByScalar :
func (b Box2) ExpandByScalar(scalar float64) *Box2 {
	b.Min.AddScalar(-scalar)
	b.Max.AddScalar(scalar)

	return &b
}

// ContainsPoint :
func (b Box2) ContainsPoint(point Vector2) bool {
	return !(point.X < b.Min.X || point.X > b.Max.X ||
		point.Y < b.Min.Y || point.Y > b.Max.Y)
}

// ContainsBox :
func (b Box2) ContainsBox(box Box2) bool {
	return b.Min.X <= box.Min.X && box.Max.X <= b.Max.X &&
		b.Min.Y <= box.Min.Y && box.Max.Y <= b.Max.Y
}

// GetParameter :
func (b Box2) GetParameter(point, target Vector2) *Vector2 {
	// This can potentially have a divide by zero if the box
	// has a size dimension of 0.
	return target.Set(
		(point.X-b.Min.X)/(b.Max.X-b.Min.X),
		(point.Y-b.Min.Y)/(b.Max.Y-b.Min.Y),
	)
}

// IntersectsBox :
func (b Box2) IntersectsBox(box Box2) bool {
	// using 4 splitting planes to rule out intersections
	return !(box.Max.X < b.Min.X || box.Min.X > b.Max.X ||
		box.Max.Y < b.Min.Y || box.Min.Y > b.Max.Y)
}

// ClampPoint :
func (b Box2) ClampPoint(point, target Vector2) *Vector2 {
	return target.Copy(point).Clamp(b.Min, b.Max)
}

// DistanceToPoint :
func (b Box2) DistanceToPoint(point Vector2) float64 {
	clampedPoint := _vector.Copy(point).Clamp(b.Min, b.Max)
	return clampedPoint.Sub(point).Length()
}

// Intersect :
func (b Box2) Intersect(box Box2) *Box2 {
	b.Min.Max(box.Min)
	b.Max.Min(box.Max)

	return &b
}

// Union :
func (b Box2) Union(box Box2) *Box2 {
	b.Min.Min(box.Min)
	b.Max.Max(box.Max)

	return &b
}

// Translate :
func (b Box2) Translate(offset Vector2) *Box2 {
	b.Min.Add(offset)
	b.Max.Add(offset)

	return &b
}

// Equals :
func (b Box2) Equals(box Box2) bool {
	return box.Min.Equals(b.Min) && box.Max.Equals(b.Max)
}
