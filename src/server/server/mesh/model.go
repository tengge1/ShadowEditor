// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package mesh

import "time"

// Model 模型信息
type Model struct {
	// ID
	ID string
	// 名称
	Name string
	// 类别ID
	CategoryID string
	// 类别名称
	CategoryName string
	// 全拼
	TotalPinYin string
	// 首字母拼音
	FirstPinYin string
	// 模型类型
	Type string
	// 下载地址
	URL string `json:"Url"`
	// 上传文件名称
	FileName string
	// 文件大小
	FileSize string
	// 文件类型
	FileType string
	// 保存文件名称
	SaveName string
	// 保存路径
	SavePath string
	// 上传时间
	AddTime time.Time
	// 缩略图
	Thumbnail string
}
