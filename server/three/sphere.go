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

// NewSphere :
func NewSphere(center Vector3, radius float64) *Sphere {
	return &Sphere{center, radius}
}

// Sphere :
type Sphere struct {
	Center Vector3
	Radius float64
}

// Set :
func (s Sphere) Set(center Vector3, radius float64) *Sphere {
	s.Center.Copy(center)
	s.Radius = radius
	return &s
}

// SetFromPoints :
func (s Sphere) SetFromPoints(points []Vector3, optionalCenter Vector3) *Sphere {
	center := s.Center
	center.Copy(optionalCenter)

	maxRadiusSq := float64(0)

	for i, il := 0, len(points); i < il; i++ {
		maxRadiusSq = math.Max(maxRadiusSq, center.DistanceToSquared(points[i]))
	}

	s.Radius = math.Sqrt(maxRadiusSq)
	return &s
}

// Clone :
func (s Sphere) Clone() *Sphere {
	return NewSphere(s.Center, s.Radius).Copy(s)
}

// Copy :
func (s Sphere) Copy(sphere Sphere) *Sphere {
	s.Center.Copy(sphere.Center)
	s.Radius = sphere.Radius
	return &s
}

// IsEmpty :
func (s Sphere) IsEmpty() bool {
	return s.Radius < 0
}

// MakeEmpty :
func (s Sphere) MakeEmpty() *Sphere {
	s.Center.Set(0, 0, 0)
	s.Radius = -1
	return &s
}

// ContainsPoint :
func (s Sphere) ContainsPoint(point Vector3) bool {
	return point.DistanceToSquared(s.Center) <= s.Radius*s.Radius
}

// DistanceToPoint :
func (s Sphere) DistanceToPoint(point Vector3) float64 {
	return point.DistanceTo(s.Center) - s.Radius
}

// IntersectsSphere :
func (s Sphere) IntersectsSphere(sphere Sphere) bool {
	radiusSum := s.Radius + sphere.Radius
	return sphere.Center.DistanceToSquared(s.Center) <= radiusSum*radiusSum
}

// IntersectsBox :
func (s Sphere) IntersectsBox(box Box3) bool {
	return box.IntersectsSphere(s)
}

// IntersectsPlane :
func (s Sphere) IntersectsPlane(plane Plane) bool {
	return math.Abs(plane.DistanceToPoint(s.Center)) <= s.Radius
}

// ClampPoint :
func (s Sphere) ClampPoint(point, target Vector3) *Vector3 {
	deltaLengthSq := s.Center.DistanceToSquared(point)
	target.Copy(point)

	if deltaLengthSq > s.Radius*s.Radius {
		target.Sub(s.Center).Normalize()
		target.MultiplyScalar(s.Radius).Add(s.Center)
	}

	return &target
}

// GetBoundingBox :
func (s Sphere) GetBoundingBox(target Box3) *Box3 {
	if s.IsEmpty() {
		// Empty sphere produces empty bounding box
		target.MakeEmpty()
		return &target
	}

	target.Set(s.Center, s.Center)
	target.ExpandByScalar(s.Radius)

	return &target
}

// ApplyMatrix4 :
func (s Sphere) ApplyMatrix4(matrix Matrix4) *Sphere {
	s.Center.ApplyMatrix4(matrix)
	s.Radius = s.Radius * matrix.GetMaxScaleOnAxis()
	return &s
}

// Translate :
func (s Sphere) Translate(offset Vector3) *Sphere {
	s.Center.Add(offset)
	return &s
}

// Equals :
func (s Sphere) Equals(sphere Sphere) bool {
	return sphere.Center.Equals(s.Center) && sphere.Radius == s.Radius
}
