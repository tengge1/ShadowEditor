// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor
//
// Note: This file is translated from:
// https://docs.microsoft.com/en-us/bingmaps/articles/bing-maps-tile-system?redirectedfrom=MSDN

package gis

import (
	"bytes"
	"math"
)

const (
	// EarthRadius is the radius of the earth.
	EarthRadius float64 = 6378137
	// MinLatitude is the min latitude of the bing map.
	MinLatitude float64 = -85.05112878
	// MaxLatitude is the max latitude of the bing map.
	MaxLatitude float64 = 85.05112878
	// MinLongitude is the min longitude of the bing map.
	MinLongitude float64 = -180
	// MaxLongitude is the max longitude of the bing map.
	MaxLongitude float64 = 180
)

// Clip clips a number to the specified minimum and maximum values.
func Clip(n, minValue, maxValue float64) float64 {
	return math.Min(math.Max(n, minValue), maxValue)
}

// MapSize determines the map width and height (in pixels) at a specified level
// of detail.
func MapSize(levelOfDetail int) uint {
	return uint(256 << levelOfDetail)
}

// GroundResolution determines the ground resolution (in meters per pixel) at a specified
// latitude and level of detail.
func GroundResolution(latitude float64, levelOfDetail int) float64 {
	latitude = Clip(latitude, MinLatitude, MaxLatitude)
	return math.Cos(latitude*math.Pi/180) * 2 * math.Pi * EarthRadius / float64(MapSize(levelOfDetail))
}

// MapScale determines the map scale at a specified latitude, level of detail,
// and screen resolution.
func MapScale(latitude float64, levelOfDetail, screenDpi int) float64 {
	return GroundResolution(latitude, levelOfDetail) * float64(screenDpi) / 0.0254
}

// LatLongToPixelXY converts a point from latitude/longitude WGS-84 coordinates (in degrees)
// into pixel XY coordinates at a specified level of detail.
func LatLongToPixelXY(latitude, longitude float64, levelOfDetail int) (pixelX, pixelY int) {
	latitude = Clip(latitude, MinLatitude, MaxLatitude)
	longitude = Clip(longitude, MinLongitude, MaxLongitude)

	x := (longitude + 180) / 360
	sinLatitude := math.Sin(latitude * math.Pi / 180)
	y := 0.5 - math.Log((1+sinLatitude)/(1-sinLatitude))/(4*math.Pi)

	mapSize := float64(MapSize(levelOfDetail))
	pixelX = int(Clip(x*mapSize+0.5, 0, mapSize-1))
	pixelY = int(Clip(y*mapSize+0.5, 0, mapSize-1))
	return
}

// PixelXYToLatLong converts a pixel from pixel XY coordinates at a specified level of detail
// into latitude/longitude WGS-84 coordinates (in degrees).
func PixelXYToLatLong(pixelX, pixelY, levelOfDetail int) (latitude, longitude float64) {
	mapSize := float64(MapSize(levelOfDetail))
	x := (Clip(float64(pixelX), 0, mapSize-1) / mapSize) - 0.5
	y := 0.5 - (Clip(float64(pixelY), 0, mapSize-1) / mapSize)

	latitude = 90 - 360*math.Atan(math.Exp(-y*2*math.Pi))/math.Pi
	longitude = 360 * x
	return
}

// PixelXYToTileXY converts pixel XY coordinates into tile XY coordinates of the tile containing
// the specified pixel.
func PixelXYToTileXY(pixelX, pixelY int) (tileX, tileY int) {
	tileX = pixelX / 256
	tileY = pixelY / 256
	return
}

// TileXYToPixelXY converts tile XY coordinates into pixel XY coordinates of the upper-left pixel
// of the specified tile.
func TileXYToPixelXY(tileX, tileY int) (pixelX, pixelY int) {
	pixelX = tileX * 256
	pixelY = tileY * 256
	return
}

// TileXYToQuadKey converts tile XY coordinates into a QuadKey at a specified level of detail.
func TileXYToQuadKey(tileX, tileY, levelOfDetail int) string {
	var quadKey bytes.Buffer
	for i := levelOfDetail; i > 0; i-- {
		digit := '0'
		mask := 1 << (i - 1)
		if (tileX & mask) != 0 {
			digit++
		}
		if (tileY & mask) != 0 {
			digit++
			digit++
		}
		quadKey.WriteRune(digit)
	}
	return quadKey.String()
}

// QuadKeyToTileXY converts a QuadKey into tile XY coordinates.
func QuadKeyToTileXY(quadKey string) (tileX, tileY, levelOfDetail int) {
	tileX, tileY = 0, 0
	levelOfDetail = len(quadKey)
	for i := levelOfDetail; i > 0; i-- {
		mask := 1 << (i - 1)
		switch quadKey[levelOfDetail-i] {
		default:
			panic("Invalid QuadKey digit sequence.")
		case '0':
		case '1':
			tileX |= mask
		case '2':
			tileY |= mask
		case '3':
			tileX |= mask
			tileY |= mask
		}
	}
	return
}
