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
	"io/ioutil"
	"os"
	"path"
)

// CopyDirectory copy one directory and its content to another
func CopyDirectory(sourceDirName, destDirName string) error {
	stat, err := os.Stat(sourceDirName)
	if err != nil {
		if !os.IsExist(err) {
			return fmt.Errorf("sourceDirName (%v) is not existed", sourceDirName)
		}
		return err
	}
	if !stat.IsDir() {
		return fmt.Errorf("sourceDirName (%v) is not a directory", sourceDirName)
	}

	stat, err = os.Stat(destDirName)
	if err == nil && !stat.IsDir() {
		return fmt.Errorf("destDirName (%v) is a file", destDirName)
	}

	return copyDirectory(sourceDirName, destDirName)
}

func copyDirectory(sourceDirName, destDirName string) error {
	_, err := os.Stat(destDirName)
	if !os.IsExist(err) {
		os.MkdirAll(destDirName, 0755)
	} else if err != nil {
		return nil
	}

	infos, err := ioutil.ReadDir(sourceDirName)

	if err != nil {
		return nil
	}

	for _, info := range infos {
		source := path.Join(sourceDirName, info.Name())
		dest := path.Join(destDirName, info.Name())
		if info.IsDir() {
			if err := copyDirectory(source, dest); err != nil {
				return err
			}
		} else {
			sourceFile, err := os.Open(source)
			if err != nil {
				return err
			}
			defer sourceFile.Close()
			destFile, err := os.Create(dest)
			if err != nil {
				return err
			}
			defer destFile.Close()
			_, err = io.Copy(sourceFile, destFile)
			if err != nil {
				return err
			}
		}
	}

	return err
}
