// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package scene

import "time"

// HistoryModel 场景历史模型
type HistoryModel struct {
	// 场景历史ID
	ID string
	// 场景ID
	SceneID string
	// 场景名称
	SceneName string
	// 版本
	Version int
	// 是否最新版本
	IsNew bool
	// 创建时间
	CreateTime time.Time
	// 更新时间
	UpdateTime time.Time
}
