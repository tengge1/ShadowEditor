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

// NewSphericalHarmonics3 :
// Primary reference:
//   https://graphics.stanford.edu/papers/envmap/envmap.pdf
// Secondary reference:
//   https://www.ppsloan.org/publications/StupidSH36.pdf
// 3-band SH defined by 9 coefficients
func NewSphericalHarmonics3() *SphericalHarmonics3 {
	coefficients := [9]Vector3{}
	for i := 0; i < 9; i++ {
		coefficients[i] = Vector3{}
	}
	return &SphericalHarmonics3{coefficients}
}

// SphericalHarmonics3 :
type SphericalHarmonics3 struct {
	Coefficients [9]Vector3
}

// Set :
func (s SphericalHarmonics3) Set(coefficients [9]Vector3) *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].Copy(coefficients[i])
	}
	return &s
}

// Zero :
func (s SphericalHarmonics3) Zero() *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].Set(0, 0, 0)
	}
	return &s
}

// GetAt get the radiance in the direction of the normal
// target is a Vector3
func (s SphericalHarmonics3) GetAt(normal, target Vector3) *Vector3 {
	// normal is assumed to be unit length
	x, y, z := normal.X, normal.Y, normal.Z
	coeff := s.Coefficients
	// band 0
	target.Copy(coeff[0]).MultiplyScalar(0.282095)
	// band 1
	target.AddScaledVector(coeff[1], 0.488603*y)
	target.AddScaledVector(coeff[2], 0.488603*z)
	target.AddScaledVector(coeff[3], 0.488603*x)
	// band 2
	target.AddScaledVector(coeff[4], 1.092548*(x*y))
	target.AddScaledVector(coeff[5], 1.092548*(y*z))
	target.AddScaledVector(coeff[6], 0.315392*(3.0*z*z-1.0))
	target.AddScaledVector(coeff[7], 1.092548*(x*z))
	target.AddScaledVector(coeff[8], 0.546274*(x*x-y*y))
	return &target
}

// GetIrradianceAt get the irradiance (radiance convolved with cosine lobe) in the direction of the normal
// target is a Vector3
// https://graphics.stanford.edu/papers/envmap/envmap.pdf
func (s SphericalHarmonics3) GetIrradianceAt(normal, target Vector3) *Vector3 {
	// normal is assumed to be unit length
	x, y, z := normal.X, normal.Y, normal.Z
	var coeff = s.Coefficients
	// band 0
	target.Copy(coeff[0]).MultiplyScalar(0.886227) // π * 0.282095
	// band 1
	target.AddScaledVector(coeff[1], 2.0*0.511664*y) // ( 2 * π / 3 ) * 0.488603
	target.AddScaledVector(coeff[2], 2.0*0.511664*z)
	target.AddScaledVector(coeff[3], 2.0*0.511664*x)
	// band 2
	target.AddScaledVector(coeff[4], 2.0*0.429043*x*y) // ( π / 4 ) * 1.092548
	target.AddScaledVector(coeff[5], 2.0*0.429043*y*z)
	target.AddScaledVector(coeff[6], 0.743125*z*z-0.247708) // ( π / 4 ) * 0.315392 * 3
	target.AddScaledVector(coeff[7], 2.0*0.429043*x*z)
	target.AddScaledVector(coeff[8], 0.429043*(x*x-y*y)) // ( π / 4 ) * 0.546274
	return &target
}

// Add :
func (s SphericalHarmonics3) Add(sh SphericalHarmonics3) *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].Add(sh.Coefficients[i])
	}
	return &s
}

// AddScaledSH :
func (s SphericalHarmonics3) AddScaledSH(sh SphericalHarmonics3, t float64) *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].AddScaledVector(sh.Coefficients[i], t)
	}
	return &s
}

// Scale :
func (s SphericalHarmonics3) Scale(t float64) *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].MultiplyScalar(t)
	}
	return &s
}

// Lerp :
func (s SphericalHarmonics3) Lerp(sh SphericalHarmonics3, alpha float64) *SphericalHarmonics3 {
	for i := 0; i < 9; i++ {
		s.Coefficients[i].Lerp(sh.Coefficients[i], alpha)
	}
	return &s
}

// Equals :
func (s SphericalHarmonics3) Equals(sh SphericalHarmonics3) bool {
	for i := 0; i < 9; i++ {
		if !s.Coefficients[i].Equals(sh.Coefficients[i]) {
			return false
		}
	}
	return true
}

// Copy :
func (s SphericalHarmonics3) Copy(sh SphericalHarmonics3) *SphericalHarmonics3 {
	return s.Set(sh.Coefficients)
}

// Clone :
func (s SphericalHarmonics3) Clone() *SphericalHarmonics3 {
	return NewSphericalHarmonics3().Copy(s)
}

// FromArray :
func (s SphericalHarmonics3) FromArray(array []float64, offset int) *SphericalHarmonics3 {
	if len(array) < offset+27 {
		panic("array length should be greater than offset+27")
	}
	coefficients := s.Coefficients
	for i := 0; i < 9; i++ {
		coefficients[i].FromArray(array, offset+(i*3))
	}
	return &s
}

// ToArray :
func (s SphericalHarmonics3) ToArray(array []float64, offset int) []float64 {
	if len(array) < offset+27 {
		panic("array length should be greater than offset+27")
	}
	coefficients := s.Coefficients
	for i := 0; i < 9; i++ {
		coefficients[i].ToArray(array, offset+(i*3))
	}
	return array
}

// getBasisAt evaluate the basis functions
// shBasis is an Array[ 9 ]
func getBasisAt(normal Vector3, shBasis [9]float64) {
	// normal is assumed to be unit length
	x, y, z := normal.X, normal.Y, normal.Z
	// band 0
	shBasis[0] = 0.282095
	// band 1
	shBasis[1] = 0.488603 * y
	shBasis[2] = 0.488603 * z
	shBasis[3] = 0.488603 * x
	// band 2
	shBasis[4] = 1.092548 * x * y
	shBasis[5] = 1.092548 * y * z
	shBasis[6] = 0.315392 * (3*z*z - 1)
	shBasis[7] = 1.092548 * x * z
	shBasis[8] = 0.546274 * (x*x - y*y)
}
