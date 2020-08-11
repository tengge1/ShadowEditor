// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// LineStringFeature represents a LineString.
type LineStringFeature struct {
	// Type should always be `Feature`.
	Type       string                 `json:"type"`
	ID         string                 `json:"id"`
	Geometry   LineStringGeometry     `json:"geometry"`
	Properties map[string]interface{} `json:"properties"`
}

// LineStringGeometry is the geometry of a LineStringFeature.
type LineStringGeometry struct {
	// Type should always be `LineString`.
	Type        GeometryType `json:"type"`
	Coordinates [][]float64  `json:"coordinates"`
}
