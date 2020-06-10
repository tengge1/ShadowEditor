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

var _vector1 = Vector3{}
var _vector2 = Vector3{}
var _normalMatrix = Matrix3{}

// NewPlane :
func NewPlane(normal Vector3, constant float64) *Plane {
	// normal is assumed to be normalized
	return &Plane{normal, constant}
}

// Plane :
type Plane struct {
	Normal   Vector3
	Constant float64
}

// Set :
func (p Plane) Set(normal Vector3, constant float64) *Plane {
	p.Normal.Copy(normal)
	p.Constant = constant
	return &p
}

// SetComponents :
func (p Plane) SetComponents(x, y, z, w float64) *Plane {
	p.Normal.Set(x, y, z)
	p.Constant = w
	return &p
}

// SetFromNormalAndCoplanarPoint :
func (p Plane) SetFromNormalAndCoplanarPoint(normal, point Vector3) *Plane {
	p.Normal.Copy(normal)
	p.Constant = -point.Dot(p.Normal)
	return &p
}

// SetFromCoplanarPoints :
func (p Plane) SetFromCoplanarPoints(a, b, c Vector3) *Plane {
	normal := _vector1.SubVectors(c, b).Cross(*_vector2.SubVectors(a, b)).Normalize()
	// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?
	p.SetFromNormalAndCoplanarPoint(*normal, a)
	return &p
}

// Clone :
func (p Plane) Clone() *Plane {
	return NewPlane(p.Normal, p.Constant).Copy(p)
}

// Copy :
func (p Plane) Copy(plane Plane) *Plane {
	p.Normal.Copy(plane.Normal)
	p.Constant = plane.Constant
	return &p
}

// Normalize :
func (p Plane) Normalize() *Plane {
	// Note: will lead to a divide by zero if the plane is invalid.
	inverseNormalLength := 1.0 / p.Normal.Length()
	p.Normal.MultiplyScalar(inverseNormalLength)
	p.Constant *= inverseNormalLength
	return &p
}

// Negate :
func (p Plane) Negate() *Plane {
	p.Constant *= -1
	p.Normal.Negate()
	return &p
}

// DistanceToPoint :
func (p Plane) DistanceToPoint(point Vector3) float64 {
	return p.Normal.Dot(point) + p.Constant
}

// DistanceToSphere :
func (p Plane) DistanceToSphere(sphere Sphere) float64 {
	return p.DistanceToPoint(sphere.Center) - sphere.Radius
}

// ProjectPoint :
func (p Plane) ProjectPoint(point, target Vector3) *Vector3 {
	return target.Copy(p.Normal).MultiplyScalar(-p.DistanceToPoint(point)).Add(point)
}

// IntersectLine :
func (p Plane) IntersectLine(line Line3, target Vector3) *Vector3 {
	direction := line.Delta(_vector1)
	denominator := p.Normal.Dot(*direction)
	if denominator == 0 {
		// line is coplanar, return origin
		if p.DistanceToPoint(line.Start) == 0 {
			return target.Copy(line.Start)
		}
		// Unsure if p is the correct method to handle p case.
		return nil
	}

	t := -(line.Start.Dot(p.Normal) + p.Constant) / denominator
	if t < 0 || t > 1 {
		return nil
	}

	return target.Copy(*direction).MultiplyScalar(t).Add(line.Start)
}

// IntersectsLine :
func (p Plane) IntersectsLine(line Line3) bool {
	// Note: p tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.
	startSign := p.DistanceToPoint(line.Start)
	endSign := p.DistanceToPoint(line.End)
	return startSign < 0 && endSign > 0 || endSign < 0 && startSign > 0
}

// IntersectsBox :
func (p Plane) IntersectsBox(box Box3) bool {
	return box.IntersectsPlane(p)
}

// IntersectsSphere :
func (p Plane) IntersectsSphere(sphere Sphere) bool {
	return sphere.IntersectsPlane(p)
}

// CoplanarPoint :
func (p Plane) CoplanarPoint(target Vector3) *Vector3 {
	return target.Copy(p.Normal).MultiplyScalar(-p.Constant)
}

// ApplyMatrix4 :
func (p Plane) ApplyMatrix4(matrix Matrix4) *Plane {
	normalMatrix := _normalMatrix.GetNormalMatrix(matrix)
	referencePoint := p.CoplanarPoint(_vector1).ApplyMatrix4(matrix)
	normal := p.Normal.ApplyMatrix3(*normalMatrix).Normalize()
	p.Constant = -referencePoint.Dot(*normal)
	return &p
}

// Translate :
func (p Plane) Translate(offset Vector3) *Plane {
	p.Constant -= offset.Dot(p.Normal)
	return &p
}

// Equals :
func (p Plane) Equals(plane Plane) bool {
	return plane.Normal.Equals(p.Normal) && plane.Constant == p.Constant
}
