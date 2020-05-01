// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package tools

import "time"

// TypefaceModel 字体模型
type TypefaceModel struct {
	// ID
	ID string
	// 名称
	Name string
	// 全拼
	TotalPinYin string
	// 首字母拼音
	FirstPinYin string
	// 下载地址
	URL string
	// 创建时间
	CreateTime time.Time
}
