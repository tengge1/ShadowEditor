// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package script

// Model 脚本模型
type Model struct {
	// MongoDB _id
	ID string
	// 父要素ID
	PID string
	// 名称
	Name string
	// 类型
	Type string
	// 源码
	Source string
	// THREE.js UUID
	UUID string
	// 排序
	Sort int
}
