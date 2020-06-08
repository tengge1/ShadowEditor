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
	"math/rand"
	"strconv"
	"strings"
)

var _lut = []string{}

func init() {
	for i := int64(0); i < 256; i++ {
		if i < 16 {
			_lut[i] = "0" + strconv.FormatInt(i, 16)
		} else {
			_lut[i] = strconv.FormatInt(i, 16)
		}
	}
}

const (
	// DEG2RAD :
	DEG2RAD = math.Pi / 180
	// RAD2DEG :
	RAD2DEG = 180 / math.Pi
)

// GenerateUUID :
func GenerateUUID() string {
	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	d0 := int64(rand.Float64()*0xffffffff) | 0
	d1 := int64(rand.Float64()*0xffffffff) | 0
	d2 := int64(rand.Float64()*0xffffffff) | 0
	d3 := int64(rand.Float64()*0xffffffff) | 0
	uuid := _lut[d0&0xff] + _lut[d0>>8&0xff] + _lut[d0>>16&0xff] + _lut[d0>>24&0xff] + "-" +
		_lut[d1&0xff] + _lut[d1>>8&0xff] + "-" + _lut[d1>>16&0x0f|0x40] + _lut[d1>>24&0xff] + "-" +
		_lut[d2&0x3f|0x80] + _lut[d2>>8&0xff] + "-" + _lut[d2>>16&0xff] + _lut[d2>>24&0xff] +
		_lut[d3&0xff] + _lut[d3>>8&0xff] + _lut[d3>>16&0xff] + _lut[d3>>24&0xff]

	// .toUpperCase() here flattens concatenated strings to save heap memory space.
	return strings.ToUpper(uuid)
}

// Clamp :
func Clamp(value, min, max float64) float64 {
	return math.Max(min, math.Min(max, value))
}

// EuclideanModulo :
// compute euclidian modulo of m % n
// https://en.wikipedia.org/wiki/Modulo_operation
func EuclideanModulo(n, m int) int {
	return ((n % m) + m) % m
}

// MapLinear :
// Linear mapping from range <a1, a2> to range <b1, b2>
func MapLinear(x, a1, a2, b1, b2 float64) float64 {
	return b1 + (x-a1)*(b2-b1)/(a2-a1)
}

// Lerp :
// https://en.wikipedia.org/wiki/Linear_interpolation
func Lerp(x, y, t float64) float64 {
	return (1-t)*x + t*y
}

// Smoothstep :
// http://en.wikipedia.org/wiki/Smoothstep
func Smoothstep(x, min, max float64) float64 {
	if x <= min {
		return 0
	}
	if x >= max {
		return 1
	}

	x = (x - min) / (max - min)
	return x * x * (3 - 2*x)
}

// Smootherstep :
func Smootherstep(x, min, max float64) float64 {
	if x <= min {
		return 0
	}
	if x >= max {
		return 1
	}

	x = (x - min) / (max - min)

	return x * x * x * (x*(x*6-15) + 10)
}

// RandInt :
// Random integer from <low, high> interval
func RandInt(low, high float64) int {
	return int(low + math.Floor(rand.Float64()*(high-low+1)))
}

// RandFloat :
// Random float from <low, high> interval
func RandFloat(low, high float64) float64 {
	return low + rand.Float64()*(high-low)
}

// RandFloatSpread :
// Random float from <-range/2, range/2> interval
func RandFloatSpread(rang float64) float64 {
	return rang * (0.5 - rand.Float64())
}

// DegToRad :
func DegToRad(degrees float64) float64 {
	return degrees * DEG2RAD
}

// RadToDeg :
func RadToDeg(radians float64) float64 {
	return radians * RAD2DEG
}

// IsPowerOfTwo :
func IsPowerOfTwo(value int) bool {
	return (value&(value-1)) == 0 && value != 0
}

// CeilPowerOfTwo :
func CeilPowerOfTwo(value float64) int {
	return int(math.Pow(2, math.Ceil(math.Log(value)/math.Ln2)))
}

// FloorPowerOfTwo :
func FloorPowerOfTwo(value float64) int {
	return int(math.Pow(2, math.Floor(math.Log(value)/math.Ln2)))
}

// SetQuaternionFromProperEuler :
func SetQuaternionFromProperEuler(q Quaternion, a, b, c float64, order string) {
	// Intrinsic Proper Euler Angles - see https://en.wikipedia.org/wiki/Euler_angles

	// rotations are applied to the axes in the order specified by 'order'
	// rotation by angle 'a' is applied first, then by angle 'b', then by angle 'c'
	// angles are in radians
	cos := math.Cos
	sin := math.Sin

	c2 := cos(b / 2)
	s2 := sin(b / 2)

	c13 := cos((a + c) / 2)
	s13 := sin((a + c) / 2)

	c1_3 := cos((a - c) / 2)
	s1_3 := sin((a - c) / 2)

	c3_1 := cos((c - a) / 2)
	s3_1 := sin((c - a) / 2)

	switch order {
	default:
		panic("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order:" + order)
	case "XYX":
		q.Set(c2*s13, s2*c1_3, s2*s1_3, c2*c13)
	case "YZY":
		q.Set(s2*s1_3, c2*s13, s2*c1_3, c2*c13)
	case "ZXZ":
		q.Set(s2*c1_3, s2*s1_3, c2*s13, c2*c13)
	case "XZX":
		q.Set(c2*s13, s2*s3_1, s2*c3_1, c2*c13)
	case "YXY":
		q.Set(s2*c3_1, c2*s13, s2*s3_1, c2*c13)
	case "ZYZ":
		q.Set(s2*s3_1, s2*c3_1, c2*s13, c2*c13)
	}
}
