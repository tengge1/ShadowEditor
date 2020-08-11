// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// MultiPointFeature represents a multi-point.
type MultiPointFeature struct {
	// Type should always be `Feature`.
	Type       string                 `json:"type"`
	ID         string                 `json:"id"`
	BBox       []float64              `json:"bbox"`
	Geometry   MultiPointGeometry     `json:"geometry"`
	Properties map[string]interface{} `json:"properties"`
}

// MultiPointGeometry is the geometry of a MultiPointFeature.
type MultiPointGeometry struct {
	// Type should always be `MultiPoint`;
	Type        GeometryType `json:"type"`
	Coordinates [][]float64  `json:"coordinates"`
}
