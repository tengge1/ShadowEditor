// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

import (
	"fmt"

	"github.com/inconshreveable/mousetrap"
	"github.com/spf13/cobra"
)

var (
	cfgFile string
	rootCmd = &cobra.Command{
		Use:   "ShadowEditor",
		Short: "3D scene editor based on three.js, golang and mongodb",
		Long: `ShadowEditor is a 3D scene editor based on three.js, golang and mongodb.
This application uses mongodb to store data.`,
	}
)

// ShouldRunService determines if Execute() is running as a service.
var ShouldRunService func() bool

// Execute executes the root command. It displays useful information, and register all other commands.
func Execute() {
	// When ShouldRunService() return true, it runs as a service on Windows.
	if ShouldRunService != nil && ShouldRunService() {
		return
	}

	// When you double click ShadowEditor.exe in the Windows explorer, run `serve` command.
	if mousetrap.StartedByExplorer() {
		// double click on the Windows system
		if err := RunServe(); err != nil {
			fmt.Println(err.Error())
		}
		wait()
	} else {
		// use command line
		rootCmd.Execute()
	}
}

func init() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "./config.toml", "config file")
}

// AddCommand register a custom command.
func AddCommand(cmd *cobra.Command) {
	rootCmd.AddCommand(cmd)
}

// SetCfgFile set config file path.
func SetCfgFile(pat string) {
	cfgFile = pat
}
