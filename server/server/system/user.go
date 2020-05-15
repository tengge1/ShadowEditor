// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package system

import "time"

// User is a user's model.
type User struct {
	// ID
	ID string
	// Username
	Username string
	// Password (md5 + Salt)
	Password string
	// Name
	Name string
	// Role ID
	RoleID string
	// Role Name (won't store in the db)
	RoleName string
	// Department ID
	DeptID string
	// Department Name (won't store in the db)
	DeptName string
	// Gender: 0-unset, 1-male, 2-female
	Gender int
	// Phone Number
	Phone string
	// Emal
	Email string
	// QQ
	QQ string
	// Create Time
	CreateTime time.Time
	// Update Time
	UpdateTime time.Time
	// Password Salt
	Salt string
	// Status(0: normal, -1: deleted)
	Status int
	// all operating authorities (won't store in the db)
	OperatingAuthorities []string
}
