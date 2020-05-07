// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package plugin

import "time"

// Model is a plugin model.
type Model struct {
	// ID
	ID string
	// Name
	Name string
	// Source
	Source string
	// Create Time
	CreateTime time.Time
	// Update Time
	UpdateTime time.Time
	// Description
	Description string
	// Status (1: enabled, 0: disabled, -1: deleted)
	Status int
}
