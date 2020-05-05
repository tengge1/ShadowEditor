// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"
	"io"
	"os"
)

// CopyFile copy one file from source path to dest path.
func CopyFile(sourcePath, destPath string) error {
	stat, err := os.Stat(sourcePath)
	if os.IsNotExist(err) {
		return fmt.Errorf("sourcePath is not existed")
	}
	if stat.IsDir() {
		return fmt.Errorf("sourcePath is dir, not file")
	}
	stat, err = os.Stat(destPath)
	if err == nil && stat.IsDir() {
		return fmt.Errorf("destPath is dir")
	}
	source, err := os.Open(sourcePath)
	if err != nil {
		return err
	}
	defer source.Close()

	dest, err := os.Create(destPath)
	if err != nil {
		return err
	}

	_, err = io.Copy(source, dest)
	return err
}
