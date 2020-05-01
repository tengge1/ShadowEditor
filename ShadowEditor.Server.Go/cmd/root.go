// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

import (
	"github.com/spf13/cobra"
)

var (
	cfgFile string

	rootCmd = &cobra.Command{
		Use:   "ShadowEditor",
		Short: "3D scene editor based on three.js",
		Long: `ShadowEditor is a 3D scene editor based on three.js.
This application uses mongodb to store data.`,
	}
)

// Execute executes the root command. It shows useful information, and register all other commands.
func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "./config.toml", "config file")

	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(versionCmd)
}
