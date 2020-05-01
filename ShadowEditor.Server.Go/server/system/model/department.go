// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

// Department 组织机构模型
type Department struct {
	// 编号
	ID string
	// 父组织机构名称
	ParentID string
	// 名称
	Name string
	// 管理员用户ID
	AdminID string
	// 管理员名称（不存数据库）
	AdminName string
	// 状态（0-正常，-1-删除）
	Status int
}
