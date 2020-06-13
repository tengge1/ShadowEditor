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

var _vectorRay = Vector3{}
var _segCenter = Vector3{}
var _segDir = Vector3{}
var _diff = Vector3{}

var _edge1 = Vector3{}
var _edge2 = Vector3{}
var _normal = Vector3{}

// NewRay :
func NewRay(origin, direction Vector3) *Ray {
	return &Ray{origin, direction}
}

// Ray :
type Ray struct {
	Origin    Vector3
	Direction Vector3
}

// Set :
func (r Ray) Set(origin, direction Vector3) *Ray {
	r.Origin.Copy(origin)
	r.Direction.Copy(direction)
	return &r
}

// Clone :
func (r Ray) Clone() *Ray {
	return NewRay(r.Origin, r.Direction).Copy(r)
}

// Copy :
func (r Ray) Copy(ray Ray) *Ray {
	r.Origin.Copy(ray.Origin)
	r.Direction.Copy(ray.Direction)
	return &r
}

// At :
func (r Ray) At(t float64, target Vector3) *Vector3 {
	return target.Copy(r.Direction).MultiplyScalar(t).Add(r.Origin)
}

// LookAt :
func (r Ray) LookAt(v Vector3) *Ray {
	r.Direction.Copy(v).Sub(r.Origin).Normalize()
	return &r
}

// Recast :
func (r Ray) Recast(t float64) *Ray {
	r.Origin.Copy(*r.At(t, _vectorRay))
	return &r
}

// ClosestPointToPoint :
func (r Ray) ClosestPointToPoint(point, target Vector3) *Vector3 {
	target.SubVectors(point, r.Origin)

	directionDistance := target.Dot(r.Direction)
	if directionDistance < 0 {
		return target.Copy(r.Origin)
	}
	return target.Copy(r.Direction).MultiplyScalar(directionDistance).Add(r.Origin)
}

// DistanceToPoint :
func (r Ray) DistanceToPoint(point Vector3) float64 {
	return math.Sqrt(r.DistanceSqToPoint(point))
}

// DistanceSqToPoint :
func (r Ray) DistanceSqToPoint(point Vector3) float64 {
	directionDistance := _vectorRay.SubVectors(point, r.Origin).Dot(r.Direction)
	// point behind the ray
	if directionDistance < 0 {
		return r.Origin.DistanceToSquared(point)
	}
	_vectorRay.Copy(r.Direction).MultiplyScalar(directionDistance).Add(r.Origin)
	return _vectorRay.DistanceToSquared(point)
}

// DistanceSqToSegment :
func (r Ray) DistanceSqToSegment(v0, v1 Vector3, closestPointOnRay, closestPointOnSegment *Vector3) float64 {
	// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteDistRaySegment.h
	// It returns the min distance between the ray and the segment
	// defined by v0 and v1
	// It can also set two optional targets :
	// - The closest point on the ray
	// - The closest point on the segment
	_segCenter.Copy(v0).Add(v1).MultiplyScalar(0.5)
	_segDir.Copy(v1).Sub(v0).Normalize()
	_diff.Copy(r.Origin).Sub(_segCenter)

	segExtent := v0.DistanceTo(v1) * 0.5
	a01 := -r.Direction.Dot(_segDir)
	b0 := _diff.Dot(r.Direction)
	b1 := -_diff.Dot(_segDir)
	c := _diff.LengthSq()
	det := math.Abs(1 - a01*a01)

	var s0, s1, sqrDist, extDet float64

	if det > 0 {
		// The ray and segment are not parallel.
		s0 = a01*b1 - b0
		s1 = a01*b0 - b1
		extDet = segExtent * det

		if s0 >= 0 {
			if s1 >= -extDet {
				if s1 <= extDet {
					// region 0
					// Minimum at interior points of ray and segment.
					var invDet = 1 / det
					s0 *= invDet
					s1 *= invDet
					sqrDist = s0*(s0+a01*s1+2*b0) + s1*(a01*s0+s1+2*b1) + c
				} else {
					// region 1
					s1 = segExtent
					s0 = math.Max(0, -(a01*s1 + b0))
					sqrDist = -s0*s0 + s1*(s1+2*b1) + c
				}
			} else {
				// region 5
				s1 = -segExtent
				s0 = math.Max(0, -(a01*s1 + b0))
				sqrDist = -s0*s0 + s1*(s1+2*b1) + c
			}
		} else {
			if s1 <= -extDet {
				// region 4
				s0 = math.Max(0, -(-a01*segExtent + b0))
				if s0 > 0 {
					s1 = -segExtent
				} else {
					s1 = math.Min(math.Max(-segExtent, -b1), segExtent)
				}
				sqrDist = -s0*s0 + s1*(s1+2*b1) + c
			} else if s1 <= extDet {
				// region 3
				s0 = 0
				s1 = math.Min(math.Max(-segExtent, -b1), segExtent)
				sqrDist = s1*(s1+2*b1) + c
			} else {
				// region 2
				s0 = math.Max(0, -(a01*segExtent + b0))
				if s0 > 0 {
					s1 = segExtent
				} else {
					s1 = math.Min(math.Max(-segExtent, -b1), segExtent)
				}
				sqrDist = -s0*s0 + s1*(s1+2*b1) + c
			}
		}
	} else {
		// Ray and segment are parallel.
		if a01 > 0 {
			s1 = -segExtent
		} else {
			s1 = segExtent
		}
		s0 = math.Max(0, -(a01*s1 + b0))
		sqrDist = -s0*s0 + s1*(s1+2*b1) + c
	}

	closestPointOnRay.Copy(r.Direction).MultiplyScalar(s0).Add(r.Origin)
	closestPointOnSegment.Copy(_segDir).MultiplyScalar(s1).Add(_segCenter)

	return sqrDist
}

// IntersectSphere :
func (r Ray) IntersectSphere(sphere Sphere, target Vector3) *Vector3 {
	_vectorRay.SubVectors(sphere.Center, r.Origin)

	tca := _vectorRay.Dot(r.Direction)
	d2 := _vectorRay.Dot(_vectorRay) - tca*tca
	radius2 := sphere.Radius * sphere.Radius
	if d2 > radius2 {
		return nil
	}

	thc := math.Sqrt(radius2 - d2)
	// t0 = first intersect point - entrance on front of sphere
	t0 := tca - thc
	// t1 = second intersect point - exit point on back of sphere
	t1 := tca + thc
	// test to see if both t0 and t1 are behind the ray - if so, return null
	if t0 < 0 && t1 < 0 {
		return nil
	}
	// test to see if t0 is behind the ray:
	// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
	// in order to always return an intersect point that is in front of the ray.
	if t0 < 0 {
		return r.At(t1, target)
	}
	// else t0 is in front of the ray, so return the first collision point scaled by t0
	return r.At(t0, target)
}

// IntersectsSphere :
func (r Ray) IntersectsSphere(sphere Sphere) bool {
	return r.DistanceSqToPoint(sphere.Center) <= (sphere.Radius * sphere.Radius)
}

// DistanceToPlane :
func (r Ray) DistanceToPlane(plane Plane) float64 {
	denominator := plane.Normal.Dot(r.Direction)
	if denominator == 0 {
		// line is coplanar, return origin
		if plane.DistanceToPoint(r.Origin) == 0 {
			return 0
		}
		// Null is preferable to undefined since undefined means.... it is undefined
		return math.Inf(1)
	}
	t := -(r.Origin.Dot(plane.Normal) + plane.Constant) / denominator
	// Return if the ray never intersects the plane
	if t >= 0 {
		return t
	}
	return math.Inf(1)
}

// IntersectPlane :
func (r Ray) IntersectPlane(plane Plane, target Vector3) *Vector3 {
	t := r.DistanceToPlane(plane)
	if math.IsInf(t, 1) {
		return nil
	}
	return r.At(t, target)
}

// IntersectsPlane :
func (r Ray) IntersectsPlane(plane Plane) bool {
	// check if the ray lies on the plane first
	distToPoint := plane.DistanceToPoint(r.Origin)
	if distToPoint == 0 {
		return true
	}
	denominator := plane.Normal.Dot(r.Direction)
	if denominator*distToPoint < 0 {
		return true
	}
	// ray origin is behind the plane (and is pointing behind it)
	return false
}

// IntersectBox :
func (r Ray) IntersectBox(box Box3, target Vector3) *Vector3 {
	var tmin, tmax, tymin, tymax, tzmin, tzmax float64

	invdirx, invdiry, invdirz := 1/r.Direction.X, 1/r.Direction.Y, 1/r.Direction.Z

	origin := r.Origin

	if invdirx >= 0 {
		tmin = (box.Min.X - origin.X) * invdirx
		tmax = (box.Max.X - origin.X) * invdirx
	} else {
		tmin = (box.Max.X - origin.X) * invdirx
		tmax = (box.Min.X - origin.X) * invdirx
	}

	if invdiry >= 0 {
		tymin = (box.Min.Y - origin.Y) * invdiry
		tymax = (box.Max.Y - origin.Y) * invdiry
	} else {
		tymin = (box.Max.Y - origin.Y) * invdiry
		tymax = (box.Min.Y - origin.Y) * invdiry
	}

	if (tmin > tymax) || (tymin > tmax) {
		return nil
	}
	// These lines also handle the case where tmin or tmax is NaN
	// (result of 0 * Infinity). x !== x returns true if x is NaN
	if tymin > tmin || tmin != tmin {
		tmin = tymin
	}
	if tymax < tmax || tmax != tmax {
		tmax = tymax
	}
	if invdirz >= 0 {
		tzmin = (box.Min.Z - origin.Z) * invdirz
		tzmax = (box.Max.Z - origin.Z) * invdirz
	} else {
		tzmin = (box.Max.Z - origin.Z) * invdirz
		tzmax = (box.Min.Z - origin.Z) * invdirz
	}
	if (tmin > tzmax) || (tzmin > tmax) {
		return nil
	}
	if tzmin > tmin || tmin != tmin {
		tmin = tzmin
	}
	if tzmax < tmax || tmax != tmax {
		tmax = tzmax
	}
	//return point closest to the ray (positive side)
	if tmax < 0 {
		return nil
	}
	if tmin >= 0 {
		return r.At(tmin, target)
	}
	return r.At(tmax, target)
}

// IntersectsBox :
func (r Ray) IntersectsBox(box Box3) bool {
	return r.IntersectBox(box, _vectorRay) != nil
}

// IntersectTriangle :
func (r Ray) IntersectTriangle(a, b, c Vector3, backfaceCulling bool, target Vector3) *Vector3 {
	// Compute the offset origin, edges, and normal.
	// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h
	_edge1.SubVectors(b, a)
	_edge2.SubVectors(c, a)
	_normal.CrossVectors(_edge1, _edge2)

	// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
	// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
	//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
	//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
	//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
	DdN := r.Direction.Dot(_normal)
	var sign float64

	if DdN > 0 {
		if backfaceCulling {
			return nil
		}
		sign = 1
	} else if DdN < 0 {
		sign = -1
		DdN = -DdN
	} else {
		return nil
	}

	_diff.SubVectors(r.Origin, a)
	DdQxE2 := sign * r.Direction.Dot(*_edge2.CrossVectors(_diff, _edge2))
	// b1 < 0, no intersection
	if DdQxE2 < 0 {
		return nil
	}

	DdE1xQ := sign * r.Direction.Dot(*_edge1.Cross(_diff))
	// b2 < 0, no intersection
	if DdE1xQ < 0 {
		return nil
	}

	// b1+b2 > 1, no intersection
	if DdQxE2+DdE1xQ > DdN {
		return nil
	}

	// Line intersects triangle, check if ray does.
	QdN := -sign * _diff.Dot(_normal)
	// t < 0, no intersection
	if QdN < 0 {
		return nil
	}

	// Ray intersects triangle.
	return r.At(QdN/DdN, target)
}

// ApplyMatrix4 :
func (r Ray) ApplyMatrix4(matrix4 Matrix4) *Ray {
	r.Origin.ApplyMatrix4(matrix4)
	r.Direction.TransformDirection(matrix4)
	return &r
}

// Equals :
func (r Ray) Equals(ray Ray) bool {
	return ray.Origin.Equals(r.Origin) && ray.Direction.Equals(r.Direction)
}
