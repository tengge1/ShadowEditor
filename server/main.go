// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package main

import (
	"fmt"

	"github.com/tengge1/shadoweditor/cmd"
)

// Here we just import and execute the root command. Keep this file tidy.
//
// First, run `go install` to install third-party dependencies.
// Then, run `go build` in this folder to create the binary file.
func main() {
	// Print all the exceptions for better user experience.
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
		}
	}()

	cmd.Execute()
}
