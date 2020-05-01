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

// Zip create a zip file.
func Zip(dir, path string) error {
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()

	w := zip.NewWriter(file)
	defer w.Close()

	return createZipFile(w, dir, dir)
}

func createZipFile(w *zip.Writer, path, root string) error {
	stat, err := os.Stat(path)
	if os.IsNotExist(err) {
		return fmt.Errorf("path is not existed: %v", path)
	}
	if stat.IsDir() {
		children, err := ioutil.ReadDir(path)
		if err != nil {
			return err
		}
		for _, child := range children {
			childPath := filepath.Join(path, child.Name())
			err = createZipFile(w, childPath, root)
			if err != nil {
				return err
			}
		}
	} else {
		source, err := os.Open(path)
		if err != nil {
			return err
		}
		defer source.Close()
		targetPath := strings.TrimLeft(path, root)
		target, err := w.Create(targetPath)
		if err != nil {
			return err
		}
		io.Copy(target, source)
	}
	return nil
}

// UnZip unzip a .zip file.
func UnZip(filename, path string) error {
	r, err := zip.OpenReader(filename)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		name := f.Name
		target := fmt.Sprintf("%v/%v", path, name)
		if f.FileInfo().IsDir() {
			_, err := os.Stat(target)
			if os.IsNotExist(err) {
				os.MkdirAll(target, 0755)
			}
		} else {
			reader, err := f.Open()
			if err != nil {
				return err
			}
			defer reader.Close()
			writer, err := os.Create(target)
			if err != nil {
				return err
			}
			defer writer.Close()
			io.Copy(writer, reader)
		}
	}
	return nil
}
