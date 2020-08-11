// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// PolygonFeature represents a Polygon.
type PolygonFeature struct {
	// Type should always be `Feature`.
	Type       string                 `json:"type"`
	ID         string                 `json:"id"`
	Geometry   PolygonGeometry        `json:"geometry"`
	Properties map[string]interface{} `json:"properties"`
}

// PolygonGeometry is the geometry of a PolygonFeature.
type PolygonGeometry struct {
	// Type should always be `Polygon`.
	Type        GeometryType  `json:"type"`
	Coordinates [][][]float64 `json:"coordinates"`
}
