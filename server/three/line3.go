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

var _startP = Vector3{}
var _startEnd = Vector3{}

// NewLine3 :
func NewLine3(start, end Vector3) *Line3 {
	return &Line3{start, end}
}

// Line3 :
type Line3 struct {
	Start Vector3
	End   Vector3
}

// Set :
func (l Line3) Set(start, end Vector3) *Line3 {
	l.Start.Copy(start)
	l.End.Copy(end)
	return &l
}

// Clone :
func (l Line3) Clone() *Line3 {
	return NewLine3(l.Start, l.End).Copy(l)
}

// Copy :
func (l Line3) Copy(line Line3) *Line3 {
	l.Start.Copy(line.Start)
	l.End.Copy(line.End)
	return &l
}

// GetCenter :
func (l Line3) GetCenter(target Vector3) *Vector3 {
	return target.AddVectors(l.Start, l.End).MultiplyScalar(0.5)
}

// Delta :
func (l Line3) Delta(target Vector3) *Vector3 {
	return target.SubVectors(l.End, l.Start)
}

// DistanceSq :
func (l Line3) DistanceSq() float64 {
	return l.Start.DistanceToSquared(l.End)
}

// Distance :
func (l Line3) Distance() float64 {
	return l.Start.DistanceTo(l.End)
}

// At :
func (l Line3) At(t float64, target Vector3) *Vector3 {
	return l.Delta(target).MultiplyScalar(t).Add(l.Start)
}

// ClosestPointToPointParameter :
func (l Line3) ClosestPointToPointParameter(point Vector3, clampToLine bool) float64 {
	_startP.SubVectors(point, l.Start)
	_startEnd.SubVectors(l.End, l.Start)

	startEnd2 := _startEnd.Dot(_startEnd)
	startEndStartP := _startEnd.Dot(_startP)

	t := startEndStartP / startEnd2
	if clampToLine {
		t = Clamp(t, 0, 1)
	}

	return t
}

// ClosestPointToPoint :
func (l Line3) ClosestPointToPoint(point Vector3, clampToLine bool, target Vector3) *Vector3 {
	t := l.ClosestPointToPointParameter(point, clampToLine)
	return l.Delta(target).MultiplyScalar(t).Add(l.Start)
}

// ApplyMatrix4 :
func (l Line3) ApplyMatrix4(matrix Matrix4) *Line3 {
	l.Start.ApplyMatrix4(matrix)
	l.End.ApplyMatrix4(matrix)
	return &l
}

// Equals :
func (l Line3) Equals(line Line3) bool {
	return line.Start.Equals(l.Start) && line.End.Equals(l.End)
}
