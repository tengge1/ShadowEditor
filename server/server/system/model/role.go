// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

import "time"

// Role 角色模型
type Role struct {
	// 编号
	ID string
	// 名称
	Name string
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 简介
	Description string
	// 状态（0-正常，-1删除）
	Status int
}
