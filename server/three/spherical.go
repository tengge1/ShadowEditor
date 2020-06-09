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

// NewSpherical create a new Spherical.
func NewSpherical(radius, phi, theta float64) *Spherical {
	return &Spherical{radius, phi, theta}
}

// Spherical :
// Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
// The polar angle (phi) is measured from the positive y-axis. The positive y-axis is up.
// The azimuthal angle (theta) is measured from the positive z-axis.
type Spherical struct {
	Radius float64
	Phi    float64
	Theta  float64
}

// Set :
func (s Spherical) Set(radius, phi, theta float64) *Spherical {
	s.Radius = radius
	s.Phi = phi
	s.Theta = theta
	return &s
}

// Clone :
func (s Spherical) Clone() *Spherical {
	return NewSpherical(0, 0, 0).Copy(s)
}

// Copy :
func (s Spherical) Copy(other Spherical) *Spherical {
	s.Radius = other.Radius
	s.Phi = other.Phi
	s.Theta = other.Theta
	return &s
}

// MakeSafe restrict phi to be betwee EPS and PI-EPS
func (s Spherical) MakeSafe() *Spherical {
	EPS := 0.000001
	s.Phi = math.Max(EPS, math.Min(math.Pi-EPS, s.Phi))
	return &s
}

// SetFromVector3 :
func (s Spherical) SetFromVector3(v Vector3) *Spherical {
	return s.SetFromCartesianCoords(v.X, v.Y, v.Z)
}

// SetFromCartesianCoords :
func (s Spherical) SetFromCartesianCoords(x, y, z float64) *Spherical {
	s.Radius = math.Sqrt(x*x + y*y + z*z)

	if s.Radius == 0 {
		s.Theta = 0
		s.Phi = 0
	} else {
		s.Theta = math.Atan2(x, z)
		s.Phi = math.Acos(Clamp(y/s.Radius, -1, 1))
	}

	return &s
}
