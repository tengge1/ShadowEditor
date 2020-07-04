// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package main

import (
	"github.com/tengge1/shadoweditor/cmd"

	// Register sub packages.
	_ "github.com/tengge1/shadoweditor/cmd/win" // windows service api

	// Register `github.com/tengge1/shadoweditor/server/assets`
	_ "github.com/tengge1/shadoweditor/server/assets/animation"  // animation api
	_ "github.com/tengge1/shadoweditor/server/assets/audio"      // audio api
	_ "github.com/tengge1/shadoweditor/server/assets/character"  // character api
	_ "github.com/tengge1/shadoweditor/server/assets/material"   // material api
	_ "github.com/tengge1/shadoweditor/server/assets/mesh"       // mesh api
	_ "github.com/tengge1/shadoweditor/server/assets/particle"   // particle api
	_ "github.com/tengge1/shadoweditor/server/assets/prefab"     // prefab api
	_ "github.com/tengge1/shadoweditor/server/assets/scene"      // scene api
	_ "github.com/tengge1/shadoweditor/server/assets/screenshot" // screenshot api
	_ "github.com/tengge1/shadoweditor/server/assets/summary"    // summary api
	_ "github.com/tengge1/shadoweditor/server/assets/texture"    // texture api
	_ "github.com/tengge1/shadoweditor/server/assets/video"      // video api

	// Register `github.com/tengge1/shadoweditor/server/category`
	_ "github.com/tengge1/shadoweditor/server/category" // category api

	// Register `github.com/tengge1/shadoweditor/server/export`
	_ "github.com/tengge1/shadoweditor/server/export/examples" // examples api
	_ "github.com/tengge1/shadoweditor/server/export/scene"    // scene api

	// Register `github.com/tengge1/shadoweditor/server/gis`
	_ "github.com/tengge1/shadoweditor/server/gis" // gis api

	// Register `github.com/tengge1/shadoweditor/server/system`
	_ "github.com/tengge1/shadoweditor/server/system/authority"  // authority api
	_ "github.com/tengge1/shadoweditor/server/system/config"     // config api
	_ "github.com/tengge1/shadoweditor/server/system/department" // department api
	_ "github.com/tengge1/shadoweditor/server/system/initialize" // initialize api
	_ "github.com/tengge1/shadoweditor/server/system/login"      // login api
	_ "github.com/tengge1/shadoweditor/server/system/register"   // register api
	_ "github.com/tengge1/shadoweditor/server/system/role"       // role api
	_ "github.com/tengge1/shadoweditor/server/system/user"       // user api

	// Register `github.com/tengge1/shadoweditor/server/tools`
	_ "github.com/tengge1/shadoweditor/server/tools/backup_database" // backup_database api
	_ "github.com/tengge1/shadoweditor/server/tools/clean_scenes"    // clean_scenes api
	_ "github.com/tengge1/shadoweditor/server/tools/plugin"          // plugin api
	_ "github.com/tengge1/shadoweditor/server/tools/typeface"        // typeface api

	// Register `github.com/tengge1/shadoweditor/server/upload`
	_ "github.com/tengge1/shadoweditor/server/upload" // upload api
)

// Here we just import and execute the root command. Keep this file tidy.
//
// First, run `go install` to install third-party dependencies.
// Then, run `go build` in this folder to create the binary file.
func main() {
	cmd.Execute()
}
