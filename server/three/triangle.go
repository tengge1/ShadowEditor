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

var _v0Triangle = Vector3{}
var _v1Triangle = Vector3{}
var _v2Triangle = Vector3{}
var _v3 = Vector3{}

var _vab = Vector3{}
var _vac = Vector3{}
var _vbc = Vector3{}
var _vap = Vector3{}
var _vbp = Vector3{}
var _vcp = Vector3{}

// NewTriangle :
func NewTriangle(a, b, c Vector3) *Triangle {
	return &Triangle{a, b, c}
}

// Triangle :
type Triangle struct {
	A Vector3
	B Vector3
	C Vector3
}

// GetNormal :
func GetNormal(a, b, c, target Vector3) *Vector3 {
	target.SubVectors(c, b)
	_v0Triangle.SubVectors(a, b)
	target.Cross(_v0Triangle)

	targetLengthSq := target.LengthSq()
	if targetLengthSq > 0 {
		return target.MultiplyScalar(1 / math.Sqrt(targetLengthSq))
	}
	return target.Set(0, 0, 0)
}

// GetBarycoord :
// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
func GetBarycoord(point, a, b, c, target Vector3) *Vector3 {
	_v0Triangle.SubVectors(c, a)
	_v1Triangle.SubVectors(b, a)
	_v2Triangle.SubVectors(point, a)

	dot00 := _v0Triangle.Dot(_v0Triangle)
	dot01 := _v0Triangle.Dot(_v1Triangle)
	dot02 := _v0Triangle.Dot(_v2Triangle)
	dot11 := _v1Triangle.Dot(_v1Triangle)
	dot12 := _v1Triangle.Dot(_v2Triangle)

	denom := dot00*dot11 - dot01*dot01

	// collinear or singular triangle
	if denom == 0 {
		// arbitrary location outside of triangle?
		// not sure if t is the best idea, maybe should be returning undefined
		return target.Set(-2, -1, -1)
	}

	invDenom := 1 / denom
	u := (dot11*dot02 - dot01*dot12) * invDenom
	v := (dot00*dot12 - dot01*dot02) * invDenom

	// barycentric coordinates must always sum to 1
	return target.Set(1-u-v, v, u)
}

// ContainsPoint :
func ContainsPoint(point, a, b, c Vector3) bool {
	GetBarycoord(point, a, b, c, _v3)
	return _v3.X >= 0 && _v3.Y >= 0 && (_v3.X+_v3.Y) <= 1
}

// GetUV :
func GetUV(point, p1, p2, p3 Vector3, uv1, uv2, uv3, target Vector2) *Vector2 {
	GetBarycoord(point, p1, p2, p3, _v3)

	target.Set(0, 0)
	target.AddScaledVector(uv1, _v3.X)
	target.AddScaledVector(uv2, _v3.Y)
	target.AddScaledVector(uv3, _v3.Z)

	return &target
}

// IsFrontFacing :
func IsFrontFacing(a, b, c, direction Vector3) bool {
	_v0Triangle.SubVectors(c, b)
	_v1Triangle.SubVectors(a, b)

	// strictly front facing
	return _v0Triangle.Cross(_v1Triangle).Dot(direction) < 0
}

// Set :
func (t Triangle) Set(a, b, c Vector3) *Triangle {
	t.A.Copy(a)
	t.B.Copy(b)
	t.C.Copy(c)
	return &t
}

// SetFromPointsAndIndices :
func (t Triangle) SetFromPointsAndIndices(points []Vector3, i0, i1, i2 int) *Triangle {
	t.A.Copy(points[i0])
	t.B.Copy(points[i1])
	t.C.Copy(points[i2])
	return &t
}

// Clone :
func (t Triangle) Clone() *Triangle {
	return NewTriangle(t.A, t.B, t.C).Copy(t)
}

// Copy :
func (t Triangle) Copy(triangle Triangle) *Triangle {
	t.A.Copy(triangle.A)
	t.B.Copy(triangle.B)
	t.C.Copy(triangle.C)
	return &t
}

// GetArea :
func (t Triangle) GetArea() float64 {
	_v0Triangle.SubVectors(t.C, t.B)
	_v1Triangle.SubVectors(t.A, t.B)
	return _v0Triangle.Cross(_v1Triangle).Length() * 0.5
}

// GetMidpoint :
func (t Triangle) GetMidpoint(target Vector3) *Vector3 {
	return target.AddVectors(t.A, t.B).Add(t.C).MultiplyScalar(1 / 3)
}

// GetNormal :
func (t Triangle) GetNormal(target Vector3) *Vector3 {
	return GetNormal(t.A, t.B, t.C, target)
}

// GetPlane :
func (t Triangle) GetPlane(target Plane) *Plane {
	return target.SetFromCoplanarPoints(t.A, t.B, t.C)
}

// GetBarycoord :
func (t Triangle) GetBarycoord(point, target Vector3) *Vector3 {
	return GetBarycoord(point, t.A, t.B, t.C, target)
}

// GetUV :
func (t Triangle) GetUV(point Vector3, uv1, uv2, uv3, target Vector2) *Vector2 {
	return GetUV(point, t.A, t.B, t.C, uv1, uv2, uv3, target)
}

// ContainsPoint :
func (t Triangle) ContainsPoint(point Vector3) bool {
	return ContainsPoint(point, t.A, t.B, t.C)
}

// IsFrontFacing :
func (t Triangle) IsFrontFacing(direction Vector3) bool {
	return IsFrontFacing(t.A, t.B, t.C, direction)
}

// IntersectsBox :
func (t Triangle) IntersectsBox(box Box3) bool {
	return box.IntersectsTriangle(t)
}

// ClosestPointToPoint :
func (t Triangle) ClosestPointToPoint(p, target Vector3) *Vector3 {
	a, b, c := t.A, t.B, t.C
	var v, w float64

	// algorithm thanks to Real-Time Collision Detection by Christer Ericson,
	// published by Morgan Kaufmann Publishers, (c) 2005 Elsevier Inc.,
	// under the accompanying license; see chapter 5.1.5 for detailed explanation.
	// basically, we're distinguishing which of the voronoi regions of the triangle
	// the point lies in with the minimum amount of redundant computation.
	_vab.SubVectors(b, a)
	_vac.SubVectors(c, a)
	_vap.SubVectors(p, a)
	d1 := _vab.Dot(_vap)
	d2 := _vac.Dot(_vap)
	if d1 <= 0 && d2 <= 0 {
		// vertex region of A; barycentric coords (1, 0, 0)
		return target.Copy(a)
	}

	_vbp.SubVectors(p, b)
	d3 := _vab.Dot(_vbp)
	d4 := _vac.Dot(_vbp)
	if d3 >= 0 && d4 <= d3 {
		// vertex region of B; barycentric coords (0, 1, 0)
		return target.Copy(b)
	}

	vc := d1*d4 - d3*d2
	if vc <= 0 && d1 >= 0 && d3 <= 0 {
		v = d1 / (d1 - d3)
		// edge region of AB; barycentric coords (1-v, v, 0)
		return target.Copy(a).AddScaledVector(_vab, v)
	}

	_vcp.SubVectors(p, c)
	d5 := _vab.Dot(_vcp)
	d6 := _vac.Dot(_vcp)
	if d6 >= 0 && d5 <= d6 {
		// vertex region of C; barycentric coords (0, 0, 1)
		return target.Copy(c)
	}

	vb := d5*d2 - d1*d6
	if vb <= 0 && d2 >= 0 && d6 <= 0 {
		w = d2 / (d2 - d6)
		// edge region of AC; barycentric coords (1-w, 0, w)
		return target.Copy(a).AddScaledVector(_vac, w)
	}

	va := d3*d6 - d5*d4
	if va <= 0 && (d4-d3) >= 0 && (d5-d6) >= 0 {
		_vbc.SubVectors(c, b)
		w = (d4 - d3) / ((d4 - d3) + (d5 - d6))
		// edge region of BC; barycentric coords (0, 1-w, w)
		return target.Copy(b).AddScaledVector(_vbc, w) // edge region of BC
	}

	// face region
	denom := 1 / (va + vb + vc)
	// u = va * denom
	v = vb * denom
	w = vc * denom

	return target.Copy(a).AddScaledVector(_vab, v).AddScaledVector(_vac, w)
}

// Equals :
func (t Triangle) Equals(triangle Triangle) bool {
	return triangle.A.Equals(t.A) && triangle.B.Equals(t.B) && triangle.C.Equals(t.C)
}
