// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package system

// Register handlers in `github.com/tengge1/shadoweditor/server/tools` here.
import (
	_ "github.com/tengge1/shadoweditor/server/tools/backup_database" // backup_database api
	_ "github.com/tengge1/shadoweditor/server/tools/clean_scenes"    // clean_scenes api
	_ "github.com/tengge1/shadoweditor/server/tools/plugin"          // plugin api
	_ "github.com/tengge1/shadoweditor/server/tools/typeface"        // typeface api
)
