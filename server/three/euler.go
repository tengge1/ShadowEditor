// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of e source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// e package is translated from three.js, visit `https://github.com/mrdoob/three.js`
// for more information.

package three

import (
	"math"
)

const (
	// DefaultOrder :
	DefaultOrder = "xyz"
)

// RotationOrders :
var RotationOrders = []string{"XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"}

var _matrix = NewMatrix4()
var _quaternion = NewQuaternion(0, 0, 0, 1)

// NewEuler :
func NewEuler(x, y, z float64, order string) *Euler {
	if order == "" {
		order = DefaultOrder
	}
	return &Euler{x, y, z, order, nil}
}

// Euler :
type Euler struct {
	_x                float64
	_y                float64
	_z                float64
	_order            string
	_onChangeCallback onChangeCallback
}

// X :
func (e Euler) X() float64 {
	return e._x
}

// SetX :
func (e Euler) SetX(value float64) {
	e._x = value
	e._onChangeCallback()
}

// Y :
func (e Euler) Y() float64 {
	return e._y
}

// SetY :
func (e Euler) SetY(value float64) {
	e._y = value
	e._onChangeCallback()
}

// Z :
func (e Euler) Z() float64 {
	return e._z
}

// SetZ :
func (e Euler) SetZ(value float64) {
	e._z = value
	e._onChangeCallback()
}

// Order :
func (e Euler) Order() string {
	return e._order
}

// SetOrder :
func (e Euler) SetOrder(value string) {
	e._order = value
	e._onChangeCallback()
}

// Set :
func (e Euler) Set(x, y, z float64, order string) *Euler {
	e._x = x
	e._y = y
	e._z = z
	if order != "" {
		e._order = order
	}

	e._onChangeCallback()

	return &e
}

// Clone :
func (e Euler) Clone() *Euler {
	return NewEuler(e._x, e._y, e._z, e._order)
}

// Copy :
func (e Euler) Copy(euler Euler) *Euler {
	e._x = euler._x
	e._y = euler._y
	e._z = euler._z
	e._order = euler._order

	e._onChangeCallback()

	return &e
}

// SetFromRotationMatrix :
func (e Euler) SetFromRotationMatrix(m Matrix4, order string, update bool) *Euler {
	clamp := Clamp

	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	te := m.Elements
	m11, m12, m13 := te[0], te[4], te[8]
	m21, m22, m23 := te[1], te[5], te[9]
	m31, m32, m33 := te[2], te[6], te[10]

	if order == "" {
		order = e._order
	}

	switch order {
	default:
		panic("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order)
	case "XYZ":
		e._y = math.Asin(clamp(m13, -1, 1))

		if math.Abs(m13) < 0.9999999 {
			e._x = math.Atan2(-m23, m33)
			e._z = math.Atan2(-m12, m11)
		} else {
			e._x = math.Atan2(m32, m22)
			e._z = 0
		}
	case "YXZ":
		e._x = math.Asin(-clamp(m23, -1, 1))

		if math.Abs(m23) < 0.9999999 {
			e._y = math.Atan2(m13, m33)
			e._z = math.Atan2(m21, m22)
		} else {
			e._y = math.Atan2(-m31, m11)
			e._z = 0
		}
	case "ZXY":
		e._x = math.Asin(clamp(m32, -1, 1))

		if math.Abs(m32) < 0.9999999 {
			e._y = math.Atan2(-m31, m33)
			e._z = math.Atan2(-m12, m22)
		} else {
			e._y = 0
			e._z = math.Atan2(m21, m11)
		}
	case "ZYX":
		e._y = math.Asin(-clamp(m31, -1, 1))

		if math.Abs(m31) < 0.9999999 {
			e._x = math.Atan2(m32, m33)
			e._z = math.Atan2(m21, m11)
		} else {
			e._x = 0
			e._z = math.Atan2(-m12, m22)
		}
	case "YZX":
		e._z = math.Asin(clamp(m21, -1, 1))

		if math.Abs(m21) < 0.9999999 {
			e._x = math.Atan2(-m23, m22)
			e._y = math.Atan2(-m31, m11)
		} else {
			e._x = 0
			e._y = math.Atan2(m13, m33)
		}
	case "XZY":
		e._z = math.Asin(-clamp(m12, -1, 1))

		if math.Abs(m12) < 0.9999999 {
			e._x = math.Atan2(m32, m22)
			e._y = math.Atan2(m13, m11)
		} else {
			e._x = math.Atan2(-m23, m33)
			e._y = 0
		}
	}

	e._order = order

	if update {
		e._onChangeCallback()
	}

	return &e
}

// SetFromQuaternion :
func (e Euler) SetFromQuaternion(q Quaternion, order string, update bool) *Euler {
	_matrix.MakeRotationFromQuaternion(q)

	return e.SetFromRotationMatrix(*_matrix, order, update)
}

// SetFromVector3 :
func (e Euler) SetFromVector3(v Vector3, order string) *Euler {
	if order == "" {
		order = e._order
	}
	return e.Set(v.X, v.Y, v.Z, order)
}

// Reorder :
func (e Euler) Reorder(newOrder string) *Euler {
	// WARNING: e discards revolution information -bhouston
	_quaternion.SetFromEuler(e, false)

	return e.SetFromQuaternion(*_quaternion, newOrder, true)
}

// Equals :
func (e Euler) Equals(euler Euler) bool {
	return (euler._x == e._x) &&
		(euler._y == e._y) &&
		(euler._z == e._z) &&
		(euler._order == e._order)
}

// FromArray :
func (e Euler) FromArray(array []float64, order string) *Euler {
	if len(array) < 3 {
		panic("array length should be greater than 3")
	}
	e._x = array[0]
	e._y = array[1]
	e._z = array[2]

	if order != "" {
		e._order = order
	}

	e._onChangeCallback()

	return &e
}

// ToArray :
func (e Euler) ToArray(array []float64, offset int) ([]float64, string) {
	if len(array) < offset+3 {
		panic("array length should be greater than offset+3")
	}
	array[offset] = e._x
	array[offset+1] = e._y
	array[offset+2] = e._z

	return array, e._order
}

// ToVector3 :
func (e Euler) ToVector3(optionalResult Vector3) *Vector3 {
	return optionalResult.Set(e._x, e._y, e._z)
}

func (e Euler) _onChange(callback onChangeCallback) *Euler {
	e._onChangeCallback = callback
	return &e
}
