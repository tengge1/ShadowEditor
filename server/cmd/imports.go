// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

// Register sub packages here.

import (
	_ "github.com/tengge1/shadoweditor/server/assets"   // assets api
	_ "github.com/tengge1/shadoweditor/server/category" // category api
	_ "github.com/tengge1/shadoweditor/server/export"   // export api
	_ "github.com/tengge1/shadoweditor/server/system"   // system api
	_ "github.com/tengge1/shadoweditor/server/tools"    // tools api
	_ "github.com/tengge1/shadoweditor/server/upload"   // upload api
)
