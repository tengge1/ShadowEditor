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

	return createZipFile(w, dir, dir)
}

func createZipFile(w *zip.Writer, path, root string) error {
	stat, err := os.Stat(path)
	if os.IsNotExist(err) {
		return fmt.Errorf("%v is not exist", path)
	}
	if stat.IsDir() { // dir
		children, err := ioutil.ReadDir(path)
		if err != nil {
			return err
		}
		for _, child := range children {
			childPath := filepath.Join(path, child.Name())
			if err = createZipFile(w, childPath, root); err != nil {
				return err
			}
		}
	} else { // file
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
				if err := os.MkdirAll(targetPath, info.Mode()); err != nil {
					return err
				}
			}
		} else { // file
			reader, err := f.Open()
			if err != nil {
				return err
			}
			defer reader.Close()
			writer, err := os.Create(targetPath)
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
