// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// GeometryType is the geometry type of a Feature.
type GeometryType string

const (
	// Point is the geometry type of a PointFeature.
	Point GeometryType = "Point"
	// MultiPoint is the geometry type of a MultiPointFeature.
	MultiPoint GeometryType = "MultiPoint"
	// LineString is the geometry type of a LineString.
	LineString GeometryType = "LineString"
	// MultiLineString is the geometry type of a MultiLineString.
	MultiLineString GeometryType = "MultiLineString"
	// Polygon is the geometry type of a Polygon.
	Polygon GeometryType = "Polygon"
	// MultiPolygon is the geometry type of a MultiPolygon.
	MultiPolygon GeometryType = "MultiPolygon"
	// GeometryCollection is the geometry type of a GeometryCollection.
	GeometryCollection GeometryType = "GeometryCollection"
)
