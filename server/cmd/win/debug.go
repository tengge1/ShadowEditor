// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

// Reference URL: https://github.com/andrewkroh/sys/blob/master/windows/svc/example/main.go

// +build windows

package win

import (
	"github.com/spf13/cobra"
	"github.com/tengge1/shadoweditor/cmd"
)

// debugCmd debug ShadowEditor service on Windows.
var debugCmd = &cobra.Command{
	Use:   "debug",
	Short: "Debug service on Windows",
	Long:  `Debug service on Windows`,
	Run: func(cmd *cobra.Command, args []string) {
		runService(ServiceName, true)
	},
}

func init() {
	cmd.AddCommand(debugCmd)
}
