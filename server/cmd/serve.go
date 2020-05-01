// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

import (
	"log"
	"os"

	"github.com/spf13/cobra"

	"github.com/tengge1/shadoweditor/server/server"

	// TODO: Is it better to move the imports to the file `../main.go`?
	_ "github.com/tengge1/shadoweditor/server/server/animation"  // animation api
	_ "github.com/tengge1/shadoweditor/server/server/assets"     // assets api
	_ "github.com/tengge1/shadoweditor/server/server/audio"      // audio api
	_ "github.com/tengge1/shadoweditor/server/server/category"   // category api
	_ "github.com/tengge1/shadoweditor/server/server/character"  // character api
	_ "github.com/tengge1/shadoweditor/server/server/export"     // export api
	_ "github.com/tengge1/shadoweditor/server/server/material"   // material api
	_ "github.com/tengge1/shadoweditor/server/server/mesh"       // mesh api
	_ "github.com/tengge1/shadoweditor/server/server/particle"   // particle api
	_ "github.com/tengge1/shadoweditor/server/server/prefab"     // prefab api
	_ "github.com/tengge1/shadoweditor/server/server/scene"      // scene api
	_ "github.com/tengge1/shadoweditor/server/server/screenshot" // screenshot api
	_ "github.com/tengge1/shadoweditor/server/server/system"     // system api
	_ "github.com/tengge1/shadoweditor/server/server/texture"    // texture api
	_ "github.com/tengge1/shadoweditor/server/server/tools"      // tools api
	_ "github.com/tengge1/shadoweditor/server/server/upload"     // upload api
	_ "github.com/tengge1/shadoweditor/server/server/video"      // video api
)

// serveCmd run the shadow editor server.
var serveCmd = &cobra.Command{
	Use:     "serve",
	Short:   "Start shadoweditor server",
	Aliases: []string{"server"},
	Long:    `Use shadoweditor server to provider scene and model data.`,
	Run: func(cmd *cobra.Command, args []string) {
		_, err := os.Stat(cfgFile)
		if os.IsNotExist(err) {
			log.Fatalf("cannot find config file: %v", cfgFile)
			return
		}

		err = server.Create(cfgFile)
		if err != nil {
			log.Fatal(err)
			return
		}

		server.Start()
	},
}
