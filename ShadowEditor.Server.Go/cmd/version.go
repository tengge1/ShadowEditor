// Copyright 2017-2020. All rights reserved.
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

// versionCmd show the version information.
//
// TODO: move the version number to one place,
// then it is easy to modify when we publish new version.
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of ShadowEditor",
	Long:  `All software has versions. This is ShadowEditor's`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("ShadowEditor version: v0.4.6")
	},
}
