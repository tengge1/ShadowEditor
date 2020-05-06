// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package animation

import "time"

// Model animation model
type Model struct {
	// ID
	ID string
	// Name
	Name string
	// Category ID
	CategoryID string
	// Category name
	CategoryName string
	// Total PinYin
	TotalPinYin string
	// The first letter of total PinYin
	FirstPinYin string
	// Animation type
	Type string
	// Download url
	URL string `json:"Url"`
	// File name
	FileName string
	// File size
	FileSize int
	// File type
	FileType string
	// Save file name
	SaveName string
	// Save path
	SavePath string
	// Upload time
	AddTime time.Time
	// Thumbnail
	Thumbnail string
}
