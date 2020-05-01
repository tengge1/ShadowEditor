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

/**
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Ref: https://en.wikipedia.org/wiki/Cylindrical_coordinate_system
 *
 */

// NewCylindrical create a new Cylindrical
func NewCylindrical(radius, theta, y float64) *Cylindrical {
	return &Cylindrical{radius, theta, y}
}

type Cylindrical struct {
	Radius float64 // distance from the origin to a point in the x-z plane
	Theta  float64 // counterclockwise angle in the x-z plane measured in radians from the positive z-axis
	Y      float64 // height above the x-z plane
}

func (c Cylindrical) Set(radius, theta, y float64) *Cylindrical {
	c.Radius = radius
	c.Theta = theta
	c.Y = y
	return &c
}

func (c Cylindrical) Clone() *Cylindrical {
	return &Cylindrical{c.Radius, c.Theta, c.Y}
}

func (c Cylindrical) Copy(other *Cylindrical) *Cylindrical {
	c.Radius = other.Radius
	c.Theta = other.Theta
	c.Y = other.Y
	return &c
}

func (c Cylindrical) setFromVector3(v Vector3) *Cylindrical {
	return c.SetFromCartesianCoords(v.X, v.Y, v.Z)
}

func (c Cylindrical) SetFromCartesianCoords(x, y, z float64) *Cylindrical {
	c.Radius = math.Sqrt(x*x + z*z)
	c.Theta = math.Atan2(x, z)
	c.Y = y
	return &c
}
