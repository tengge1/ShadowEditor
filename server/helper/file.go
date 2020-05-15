// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"io/ioutil"
	"os"
)

// CopyFile copy one file from source path to dest path.
func CopyFile(sourcePath, destPath string) {
	stat, err := os.Stat(sourcePath)
	if os.IsNotExist(err) {
		panic("sourcePath is not existed")
	}
	if stat.IsDir() {
		panic("sourcePath is dir, not file")
	}
	stat, err = os.Stat(destPath)
	if err == nil && stat.IsDir() {
		panic("destPath is dir")
	}

	bytes, err := ioutil.ReadFile(sourcePath)
	if err != nil {
		panic(err)
	}

	if err = ioutil.WriteFile(destPath, bytes, 0755); err != nil {
		panic(err)
	}
}
