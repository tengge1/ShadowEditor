// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package audio

import "time"

// Model is the audio model.
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
	// Audio Type
	Type string
	// Download URL
	URL string `json:"Url"`
	// Version Number
	Version int
	// Create Time
	CreateTime time.Time
	// Last Update Time
	UpdateTime time.Time
	// Thumbnail
	Thumbnail string
}
