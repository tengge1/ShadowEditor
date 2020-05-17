// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

// Register sub packages here.

import (
	// Register `github.com/tengge1/shadoweditor/server/server/assets`
	_ "github.com/tengge1/shadoweditor/server/server/assets/animation"  // animation api
	_ "github.com/tengge1/shadoweditor/server/server/assets/audio"      // audio api
	_ "github.com/tengge1/shadoweditor/server/server/assets/character"  // character api
	_ "github.com/tengge1/shadoweditor/server/server/assets/material"   // material api
	_ "github.com/tengge1/shadoweditor/server/server/assets/mesh"       // mesh api
	_ "github.com/tengge1/shadoweditor/server/server/assets/particle"   // particle api
	_ "github.com/tengge1/shadoweditor/server/server/assets/prefab"     // prefab api
	_ "github.com/tengge1/shadoweditor/server/server/assets/scene"      // scene api
	_ "github.com/tengge1/shadoweditor/server/server/assets/screenshot" // screenshot api
	_ "github.com/tengge1/shadoweditor/server/server/assets/summary"    // summary api
	_ "github.com/tengge1/shadoweditor/server/server/assets/texture"    // texture api
	_ "github.com/tengge1/shadoweditor/server/server/assets/video"      // video api

	// Register `github.com/tengge1/shadoweditor/server/server/category`
	_ "github.com/tengge1/shadoweditor/server/server/category" // category api

	// Register `github.com/tengge1/shadoweditor/server/server/export`
	_ "github.com/tengge1/shadoweditor/server/server/export/examples" // examples api
	_ "github.com/tengge1/shadoweditor/server/server/export/scene"    // scene api

	// Register `github.com/tengge1/shadoweditor/server/server/system`
	_ "github.com/tengge1/shadoweditor/server/server/system/authority"  // authority api
	_ "github.com/tengge1/shadoweditor/server/server/system/config"     // config api
	_ "github.com/tengge1/shadoweditor/server/server/system/department" // department api
	_ "github.com/tengge1/shadoweditor/server/server/system/initialize" // initialize api
	_ "github.com/tengge1/shadoweditor/server/server/system/login"      // login api
	_ "github.com/tengge1/shadoweditor/server/server/system/register"   // register api
	_ "github.com/tengge1/shadoweditor/server/server/system/role"       // role api
	_ "github.com/tengge1/shadoweditor/server/server/system/user"       // user api

	// Register `github.com/tengge1/shadoweditor/server/server/tools`
	_ "github.com/tengge1/shadoweditor/server/server/tools/backup_database" // backup_database api
	_ "github.com/tengge1/shadoweditor/server/server/tools/clean_scenes"    // clean_scenes api
	_ "github.com/tengge1/shadoweditor/server/server/tools/plugin"          // plugin api
	_ "github.com/tengge1/shadoweditor/server/server/tools/typeface"        // typeface api

	// Register `github.com/tengge1/shadoweditor/server/server/upload`
	_ "github.com/tengge1/shadoweditor/server/server/upload" // upload api
)
