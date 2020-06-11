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

var _points = []Vector3{
	Vector3{},
	Vector3{},
	Vector3{},
	Vector3{},
	Vector3{},
	Vector3{},
	Vector3{},
	Vector3{},
}

var _vectorB3 = Vector3{}

var _box = Box3{}

// triangle centered vertices

var _v0 = Vector3{}
var _v1 = Vector3{}
var _v2 = Vector3{}

// triangle edge vectors

var _f0 = Vector3{}
var _f1 = Vector3{}
var _f2 = Vector3{}

var _center = Vector3{}
var _extents = Vector3{}
var _triangleNormal = Vector3{}
var _testAxis = Vector3{}

// NewBox3 :
func NewBox3(min, max Vector3) *Box3 {
	return &Box3{min, max}
}

// Box3 :
type Box3 struct {
	Min Vector3
	Max Vector3
}

// Set :
func (b Box3) Set(min, max Vector3) *Box3 {
	b.Min.Copy(min)
	b.Max.Copy(max)
	return &b
}

// SetFromArray :
func (b Box3) SetFromArray(array []float64) *Box3 {
	minX := math.Inf(1)
	minY := math.Inf(1)
	minZ := math.Inf(1)

	maxX := math.Inf(-1)
	maxY := math.Inf(-1)
	maxZ := math.Inf(-1)

	for i, l := 0, len(array); i < l; i += 3 {
		x := array[i]
		y := array[i+1]
		z := array[i+2]

		if x < minX {
			minX = x
		}
		if y < minY {
			minY = y
		}
		if z < minZ {
			minZ = z
		}

		if x > maxX {
			maxX = x
		}
		if y > maxY {
			maxY = y
		}
		if z > maxZ {
			maxZ = z
		}
	}

	b.Min.Set(minX, minY, minZ)
	b.Max.Set(maxX, maxY, maxZ)

	return &b
}

// SetFromPoints :
func (b Box3) SetFromPoints(points []Vector3) *Box3 {
	b.MakeEmpty()

	for i, il := 0, len(points); i < il; i++ {
		b.ExpandByPoint(points[i])
	}

	return &b
}

// SetFromCenterAndSize :
func (b Box3) SetFromCenterAndSize(center, size Vector3) *Box3 {
	halfSize := _vectorB3.Copy(size).MultiplyScalar(0.5)

	b.Min.Copy(center).Sub(*halfSize)
	b.Max.Copy(center).Add(*halfSize)

	return &b
}

// Clone :
func (b Box3) Clone() *Box3 {
	return NewBox3(Vector3{}, Vector3{}).Copy(b)
}

// Copy :
func (b Box3) Copy(box Box3) *Box3 {
	b.Min.Copy(box.Min)
	b.Max.Copy(box.Max)
	return &b
}

// MakeEmpty :
func (b Box3) MakeEmpty() *Box3 {
	b.Min.X = math.Inf(1)
	b.Min.Y = math.Inf(1)
	b.Min.Z = math.Inf(1)

	b.Max.X = math.Inf(-1)
	b.Max.Y = math.Inf(-1)
	b.Max.Z = math.Inf(-1)

	return &b
}

// IsEmpty :
func (b Box3) IsEmpty() bool {
	// b is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
	return (b.Max.X < b.Min.X) || (b.Max.Y < b.Min.Y) || (b.Max.Z < b.Min.Z)
}

// GetCenter :
func (b Box3) GetCenter(target Vector3) *Vector3 {
	if b.IsEmpty() {
		return target.Set(0, 0, 0)
	}
	return target.AddVectors(b.Min, b.Max).MultiplyScalar(0.5)
}

// GetSize :
func (b Box3) GetSize(target Vector3) *Vector3 {
	if b.IsEmpty() {
		return target.Set(0, 0, 0)
	}
	return target.SubVectors(b.Max, b.Min)
}

// ExpandByPoint :
func (b Box3) ExpandByPoint(point Vector3) *Box3 {
	b.Min.Min(point)
	b.Max.Max(point)
	return &b
}

// ExpandByVector :
func (b Box3) ExpandByVector(vector Vector3) *Box3 {
	b.Min.Sub(vector)
	b.Max.Add(vector)
	return &b
}

// ExpandByScalar :
func (b Box3) ExpandByScalar(scalar float64) *Box3 {
	b.Min.AddScalar(-scalar)
	b.Max.AddScalar(scalar)
	return &b
}

// ContainsPoint :
func (b Box3) ContainsPoint(point Vector3) bool {
	return !(point.X < b.Min.X || point.X > b.Max.X ||
		point.Y < b.Min.Y || point.Y > b.Max.Y ||
		point.Z < b.Min.Z || point.Z > b.Max.Z)
}

// ContainsBox :
func (b Box3) ContainsBox(box Box3) bool {
	return b.Min.X <= box.Min.X && box.Max.X <= b.Max.X &&
		b.Min.Y <= box.Min.Y && box.Max.Y <= b.Max.Y &&
		b.Min.Z <= box.Min.Z && box.Max.Z <= b.Max.Z
}

// GetParameter :
func (b Box3) GetParameter(point, target Vector3) *Vector3 {
	// b can potentially have a divide by zero if the box
	// has a size dimension of 0.
	return target.Set(
		(point.X-b.Min.X)/(b.Max.X-b.Min.X),
		(point.Y-b.Min.Y)/(b.Max.Y-b.Min.Y),
		(point.Z-b.Min.Z)/(b.Max.Z-b.Min.Z),
	)
}

// IntersectsBox :
func (b Box3) IntersectsBox(box Box3) bool {
	// using 6 splitting planes to rule out intersections.
	return !(box.Max.X < b.Min.X || box.Min.X > b.Max.X ||
		box.Max.Y < b.Min.Y || box.Min.Y > b.Max.Y ||
		box.Max.Z < b.Min.Z || box.Min.Z > b.Max.Z)
}

// IntersectsSphere :
func (b Box3) IntersectsSphere(sphere Sphere) bool {
	// Find the point on the AABB closest to the sphere center.
	b.ClampPoint(sphere.Center, _vectorB3)

	// If that point is inside the sphere, the AABB and sphere intersect.
	return _vectorB3.DistanceToSquared(sphere.Center) <= sphere.Radius*sphere.Radius
}

// IntersectsPlane :
func (b Box3) IntersectsPlane(plane Plane) bool {
	// We compute the minimum and maximum dot product values. If those values
	// are on the same side (back or front) of the plane, then there is no intersection.
	var min, max float64

	if plane.Normal.X > 0 {
		min = plane.Normal.X * b.Min.X
		max = plane.Normal.X * b.Max.X
	} else {
		min = plane.Normal.X * b.Max.X
		max = plane.Normal.X * b.Min.X
	}

	if plane.Normal.Y > 0 {
		min += plane.Normal.Y * b.Min.Y
		max += plane.Normal.Y * b.Max.Y
	} else {
		min += plane.Normal.Y * b.Max.Y
		max += plane.Normal.Y * b.Min.Y
	}

	if plane.Normal.Z > 0 {
		min += plane.Normal.Z * b.Min.Z
		max += plane.Normal.Z * b.Max.Z
	} else {
		min += plane.Normal.Z * b.Max.Z
		max += plane.Normal.Z * b.Min.Z
	}

	return (min <= -plane.Constant && max >= -plane.Constant)
}

// IntersectsTriangle :
func (b Box3) IntersectsTriangle(triangle Triangle) bool {
	if b.IsEmpty() {
		return false
	}

	// compute box center and extents
	b.GetCenter(_center)
	_extents.SubVectors(b.Max, _center)

	// translate triangle to aabb origin
	_v0.SubVectors(triangle.A, _center)
	_v1.SubVectors(triangle.B, _center)
	_v2.SubVectors(triangle.C, _center)

	// compute edge vectors for triangle
	_f0.SubVectors(_v1, _v0)
	_f1.SubVectors(_v2, _v1)
	_f2.SubVectors(_v0, _v2)

	// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
	// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
	// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
	var axes = []float64{
		0, -_f0.Z, _f0.Y, 0, -_f1.Z, _f1.Y, 0, -_f2.Z, _f2.Y,
		_f0.Z, 0, -_f0.X, _f1.Z, 0, -_f1.X, _f2.Z, 0, -_f2.X,
		-_f0.Y, _f0.X, 0, -_f1.Y, _f1.X, 0, -_f2.Y, _f2.X, 0,
	}
	if !satForAxes(axes, _v0, _v1, _v2, _extents) {
		return false
	}

	// test 3 face normals from the aabb
	axes = []float64{1, 0, 0, 0, 1, 0, 0, 0, 1}
	if !satForAxes(axes, _v0, _v1, _v2, _extents) {
		return false
	}

	// finally testing the face normal of the triangle
	// use already existing triangle edge vectors here
	_triangleNormal.CrossVectors(_f0, _f1)
	axes = []float64{_triangleNormal.X, _triangleNormal.Y, _triangleNormal.Z}

	return satForAxes(axes, _v0, _v1, _v2, _extents)
}

// ClampPoint :
func (b Box3) ClampPoint(point Vector3, target Vector3) *Vector3 {
	return target.Copy(point).Clamp(b.Min, b.Max)
}

// DistanceToPoint :
func (b Box3) DistanceToPoint(point Vector3) float64 {
	clampedPoint := _vectorB3.Copy(point).Clamp(b.Min, b.Max)
	return clampedPoint.Sub(point).Length()
}

// GetBoundingSphere :
func (b Box3) GetBoundingSphere(target Sphere) *Sphere {
	b.GetCenter(target.Center)
	target.Radius = b.GetSize(_vectorB3).Length() * 0.5
	return &target
}

// Intersect :
func (b Box3) Intersect(box Box3) *Box3 {
	b.Min.Max(box.Min)
	b.Max.Min(box.Max)

	// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
	if b.IsEmpty() {
		b.MakeEmpty()
	}

	return &b
}

// Union :
func (b Box3) Union(box Box3) *Box3 {
	b.Min.Min(box.Min)
	b.Max.Max(box.Max)
	return &b
}

// ApplyMatrix4 :
func (b Box3) ApplyMatrix4(matrix Matrix4) *Box3 {
	// transform of empty box is an empty box.
	if b.IsEmpty() {
		return &b
	}

	// NOTE: I am using a binary pattern to specify all 2^3 combinations below
	_points[0].Set(b.Min.X, b.Min.Y, b.Min.Z).ApplyMatrix4(matrix) // 000
	_points[1].Set(b.Min.X, b.Min.Y, b.Max.Z).ApplyMatrix4(matrix) // 001
	_points[2].Set(b.Min.X, b.Max.Y, b.Min.Z).ApplyMatrix4(matrix) // 010
	_points[3].Set(b.Min.X, b.Max.Y, b.Max.Z).ApplyMatrix4(matrix) // 011
	_points[4].Set(b.Max.X, b.Min.Y, b.Min.Z).ApplyMatrix4(matrix) // 100
	_points[5].Set(b.Max.X, b.Min.Y, b.Max.Z).ApplyMatrix4(matrix) // 101
	_points[6].Set(b.Max.X, b.Max.Y, b.Min.Z).ApplyMatrix4(matrix) // 110
	_points[7].Set(b.Max.X, b.Max.Y, b.Max.Z).ApplyMatrix4(matrix) // 111

	b.SetFromPoints(_points)

	return &b
}

// Translate :
func (b Box3) Translate(offset Vector3) *Box3 {
	b.Min.Add(offset)
	b.Max.Add(offset)

	return &b
}

// Equals :
func (b Box3) Equals(box Box3) bool {
	return box.Min.Equals(b.Min) && box.Max.Equals(b.Max)
}

// satForAxes :
func satForAxes(axes []float64, v0, v1, v2, extents Vector3) bool {
	for i, j := 0, len(axes)-3; i <= j; i += 3 {
		_testAxis.FromArray(axes, i)
		// project the aabb onto the seperating axis
		r := extents.X*math.Abs(_testAxis.X) + extents.Y*math.Abs(_testAxis.Y) + extents.Z*math.Abs(_testAxis.Z)
		// project all 3 vertices of the triangle onto the seperating axis
		p0 := v0.Dot(_testAxis)
		p1 := v1.Dot(_testAxis)
		p2 := v2.Dot(_testAxis)
		// actual test, basically see if either of the most extreme of the triangle points intersects r
		if math.Max(-math.Max(p0, math.Max(p1, p2)), math.Min(p0, math.Min(p1, p2))) > r {
			// points of the projected triangle are outside the projected half-length of the aabb
			// the axis is seperating and we can exit
			return false
		}
	}
	return true
}
