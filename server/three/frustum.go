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

var _sphere = Sphere{}
var _vectorFrustum = Vector3{}

// NewFrustum :
func NewFrustum(p0, p1, p2, p3, p4, p5 Plane) *Frustum {
	return &Frustum{
		[6]Plane{p0, p1, p2, p3, p4, p5},
	}
}

// Frustum :
type Frustum struct {
	Planes [6]Plane
}

// Set :
func (f Frustum) Set(p0, p1, p2, p3, p4, p5 Plane) *Frustum {
	planes := f.Planes

	planes[0].Copy(p0)
	planes[1].Copy(p1)
	planes[2].Copy(p2)
	planes[3].Copy(p3)
	planes[4].Copy(p4)
	planes[5].Copy(p5)

	return &f
}

// Clone :
func (f Frustum) Clone() *Frustum {
	return NewFrustum(f.Planes[0], f.Planes[1], f.Planes[2], f.Planes[3], f.Planes[4], f.Planes[5]).Copy(f)
}

// Copy :
func (f Frustum) Copy(frustum Frustum) *Frustum {
	planes := f.Planes

	for i := 0; i < 6; i++ {
		planes[i].Copy(frustum.Planes[i])
	}

	return &f
}

// SetFromProjectionMatrix :
func (f Frustum) SetFromProjectionMatrix(m Matrix4) *Frustum {
	planes := f.Planes
	me := m.Elements
	me0, me1, me2, me3 := me[0], me[1], me[2], me[3]
	me4, me5, me6, me7 := me[4], me[5], me[6], me[7]
	me8, me9, me10, me11 := me[8], me[9], me[10], me[11]
	me12, me13, me14, me15 := me[12], me[13], me[14], me[15]

	planes[0].SetComponents(me3-me0, me7-me4, me11-me8, me15-me12).Normalize()
	planes[1].SetComponents(me3+me0, me7+me4, me11+me8, me15+me12).Normalize()
	planes[2].SetComponents(me3+me1, me7+me5, me11+me9, me15+me13).Normalize()
	planes[3].SetComponents(me3-me1, me7-me5, me11-me9, me15-me13).Normalize()
	planes[4].SetComponents(me3-me2, me7-me6, me11-me10, me15-me14).Normalize()
	planes[5].SetComponents(me3+me2, me7+me6, me11+me10, me15+me14).Normalize()

	return &f
}

// IntersectsSphere :
func (f Frustum) IntersectsSphere(sphere Sphere) bool {
	planes := f.Planes
	center := sphere.Center
	negRadius := -sphere.Radius

	for i := 0; i < 6; i++ {
		distance := planes[i].DistanceToPoint(center)
		if distance < negRadius {
			return false
		}
	}

	return true
}

// IntersectsBox :
func (f Frustum) IntersectsBox(box Box3) bool {
	var planes = f.Planes
	for i := 0; i < 6; i++ {
		var plane = planes[i]
		// corner at max distance
		if plane.Normal.X > 0 {
			_vectorFrustum.X = box.Max.X
		} else {
			_vectorFrustum.X = box.Min.X
		}
		if plane.Normal.Y > 0 {
			_vectorFrustum.Y = box.Max.Y
		} else {
			_vectorFrustum.Y = box.Min.Y
		}
		if plane.Normal.Z > 0 {
			_vectorFrustum.Z = box.Max.Z
		} else {
			_vectorFrustum.Z = box.Min.Z
		}
		if plane.DistanceToPoint(_vectorFrustum) < 0 {
			return false
		}
	}
	return true
}

// ContainsPoint :
func (f Frustum) ContainsPoint(point Vector3) bool {
	var planes = f.Planes
	for i := 0; i < 6; i++ {
		if planes[i].DistanceToPoint(point) < 0 {
			return false
		}
	}
	return true
}
