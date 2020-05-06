// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package material

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

// Model is material model.
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
	// The First Letters of Total PinYin.
	FirstPinYin string
	// Create Time
	CreateTime time.Time
	// Update Time
	UpdateTime time.Time
	// Material Data
	Data bson.M
	// Thumbnail
	Thumbnail string
}
