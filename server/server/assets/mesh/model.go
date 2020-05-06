// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package mesh

import "time"

// Model is mesh model.
type Model struct {
	// ID
	ID string
	// Name
	Name string
	// Category ID
	CategoryID string
	// Category Name
	CategoryName string
	// Total PinYin
	TotalPinYin string
	// The First Letters of Total PinYin
	FirstPinYin string
	// Mesh Type
	Type string
	// Download URL
	URL string `json:"Url"`
	// File Name
	FileName string
	// File Size
	FileSize string
	// File Type
	FileType string
	// Save Name
	SaveName string
	// Save Path
	SavePath string
	// Upload Time
	AddTime time.Time
	// Thumbnail
	Thumbnail string
}
