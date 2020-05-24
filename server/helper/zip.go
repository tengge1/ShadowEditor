// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"archive/zip"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
)

// Zip reads all the files in the directory and creates a new compressed file.
func Zip(dir, path string) error {
	// check dir
	stat, err := os.Stat(dir)
	if os.IsNotExist(err) {
		return fmt.Errorf("%v is not exist", dir)
	}
	if !stat.IsDir() {
		return fmt.Errorf("%v is not a dir", dir)
	}

	// check path
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	// create zip file
	w := zip.NewWriter(file)
	defer w.Close()

	// func to create zip file
	walkFunc := func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if path == dir { // The first path of filepath.Walk is always the root.
			return nil
		}
		targetPath := strings.TrimLeft(path, dir)
		if info.IsDir() { // dir
			if _, err := w.Create(targetPath + "/"); err != nil {
				return err
			}
		} else { // file
			bytes, err := ioutil.ReadFile(path)
			if err != nil {
				return err
			}
			target, err := w.Create(targetPath)
			if err != nil {
				return err
			}
			if _, err := target.Write(bytes); err != nil {
				return err
			}
		}

		return nil
	}

	// walk all the directories and files in the dir
	if err := filepath.Walk(dir, walkFunc); err != nil {
		return err
	}

	return nil
}

// UnZip decompresses all files to a directory.
func UnZip(filename, dir string) error {
	r, err := zip.OpenReader(filename)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		name := f.Name
		info := f.FileInfo()
		targetPath := filepath.Join(dir, name)
		if info.IsDir() { // dir
			if _, err := os.Stat(targetPath); os.IsNotExist(err) {
				// IMPORTANT: info.Mode() return wrong mode when f is a dir.
				// So, DO NOT use info.Mode() to os.MkdirAll.
				if err := os.MkdirAll(targetPath, 0755); err != nil {
					return err
				}
			}
		} else { // file
			reader, err := f.Open()
			if err != nil {
				return err
			}
			defer reader.Close()
			writer, err := os.OpenFile(targetPath, os.O_CREATE|os.O_RDWR|os.O_TRUNC, info.Mode())
			if err != nil {
				return err
			}
			defer writer.Close()
			if _, err := io.Copy(writer, reader); err != nil {
				return err
			}
		}
	}

	return nil
}
