// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// versionCmd displays the version number.
//
// TODO: Move the version number tegother with the front-end,
// then it is easy to modify when we publish new version.
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number",
	Long:  `All software has versions. This is ShadowEditor's`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("ShadowEditor version: v0.5.5")
	},
}

func init() {
	AddCommand(versionCmd)
}
