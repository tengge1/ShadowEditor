// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package tools

import "time"

// PluginModel 插件模型
type PluginModel struct {
	// 编号
	ID string
	// 名称
	Name string
	// 源码
	Source string
	// 创建时间
	CreateTime time.Time
	// 最后更新时间
	UpdateTime time.Time
	// 简介
	Description string
	// 状态（0-正常，1-禁用，-1删除）
	Status int
}
