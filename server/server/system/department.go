// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package system

// Department is user department model.
type Department struct {
	// ID
	ID string
	// Parent Department ID
	ParentID string
	// Name
	Name string
	// Administrator ID
	AdminID string
	// Administrator Name (won't store in db)
	AdminName string
	// Status( 0: normal, -1: deleted)
	Status int
}
