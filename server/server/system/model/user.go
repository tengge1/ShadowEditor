// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package model

import "time"

// User 用户模型
type User struct {
	// 编号
	ID string
	// 用户名
	Username string
	// 密码（md5+盐）
	Password string
	// 姓名
	Name string
	// 角色ID
	RoleID string
	// 角色名称（不存数据库）
	RoleName string
	// 组织机构ID
	DeptID string
	// 组织机构名称（不存数据库）
	DeptName string
	// 性别：0-未设置，1-男，2-女
	Gender int
	// 手机号
	Phone string
	// 电子邮件
	Email string
	// QQ号
	QQ string
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 盐
	Salt string
	// 状态（0-正常，-1删除）
	Status int
	// 所有操作权限（不存数据库）
	OperatingAuthorities []string
}
