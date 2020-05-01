// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package audio

// Type 音频类型
type Type string

const (
	// Unknown 未知类型
	Unknown Type = "unknown"
	// Ambient 背景音乐
	Ambient Type = "ambient"
	// Effect 音效
	Effect Type = "effect"
)
