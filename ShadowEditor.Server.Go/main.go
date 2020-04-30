// Copyright 2017-2020. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package main

import "github.com/tengge1/shadoweditor/cmd"

// Here we just import and execute the root command. Keep this file tidy.
// We can run `go build` in this folder to create the shadow editor binary.
func main() {
	cmd.Execute()
}
