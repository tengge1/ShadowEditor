// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package system

// Register handlers in `github.com/tengge1/shadoweditor/server/system` here.
import (
	_ "github.com/tengge1/shadoweditor/server/system/authority"  // authority api
	_ "github.com/tengge1/shadoweditor/server/system/config"     // config api
	_ "github.com/tengge1/shadoweditor/server/system/department" // department api
	_ "github.com/tengge1/shadoweditor/server/system/initialize" // initialize api
	_ "github.com/tengge1/shadoweditor/server/system/login"      // login api
	_ "github.com/tengge1/shadoweditor/server/system/register"   // register api
	_ "github.com/tengge1/shadoweditor/server/system/role"       // role api
	_ "github.com/tengge1/shadoweditor/server/system/user"       // user api
)
