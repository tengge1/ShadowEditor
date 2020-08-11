// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// MultiLineStringFeature represents a MultiLineString.
type MultiLineStringFeature struct {
	// Type should always be `Feature`.
	Type       string                  `json:"type"`
	ID         string                  `json:"id"`
	Geometry   MultiLineStringGeometry `json:"geometry"`
	Properties map[string]interface{}  `json:"properties"`
}

// MultiLineStringGeometry is the geometry of a MultiLineStringFeature.
type MultiLineStringGeometry struct {
	// Type should always be `MultiLineString`.
	Type        GeometryType `json:"type"`
	Coordinates [][]float64  `json:"coordinates"`
}
