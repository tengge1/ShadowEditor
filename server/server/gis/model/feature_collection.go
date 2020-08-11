// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// FeatureCollection is a collection of Features.
type FeatureCollection struct {
	// Type should always be `FeatureCollection`.
	Type     string        `json:"type"`
	BBox     []float64     `json:"bbox"`
	Features []interface{} `json:"features"`
}
