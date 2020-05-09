// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package typeface

import "time"

// Model is a typeface model.
type Model struct {
	// ID
	ID string
	// Name
	Name string
	// Total PinYin.
	TotalPinYin string
	// The First Letters of Total PinYin.
	FirstPinYin string
	// Downloaded URL
	URL string `json:"Url"`
	// Create Time
	CreateTime time.Time
	// Update Time
	UpdateTime time.Time
}
