// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package texture

// Type is texture type.
type Type string

const (
	// Unknown unknown type.
	Unknown Type = "unknown"
	// AlphaMap alpha map
	AlphaMap Type = "alphaMap"
	// AoMap ao map
	AoMap Type = "aoMap"
	// BumpMap bump map
	BumpMap Type = "bumpMap"
	// DiffuseMap diffuse map
	DiffuseMap Type = "diffuseMap"
	// DisplacementMap displacement map
	DisplacementMap Type = "displacementMap"
	// EmissiveMap emissive map
	EmissiveMap Type = "emissiveMap"
	// EnvMap env map
	EnvMap Type = "envMap"
	// LightMap light map
	LightMap Type = "lightMap"
	// Map color map
	Map Type = "map"
	// MetalnessMap metalness map
	MetalnessMap Type = "metalnessMap"
	// NormalMap normal map
	NormalMap Type = "normalMap"
	// RoughnessMap roughness map
	RoughnessMap Type = "roughnessMap"
	// Cube cute map
	Cube Type = "cube"
	// Video video map
	Video Type = "video"
	// SkyBall sky ball
	SkyBall Type = "skyBall"
)
