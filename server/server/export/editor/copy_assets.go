// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package editor

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/tengge1/shadoweditor/server/helper"
)

// CopyAssets copy the assets needed to the exported scene.
func CopyAssets(path string) error {
	// copy html files
	sourceName := helper.MapPath("/index.html")
	destName := filepath.Join(path, "editor.html")
	if err := helper.CopyFile(sourceName, destName); err != nil {
		return err
	}

	bytes, err := ioutil.ReadFile(destName)
	if err != nil {
		return err
	}

	text := strings.ReplaceAll(string(bytes), "location.origin", "'.'") // make api path to current path
	if err := ioutil.WriteFile(destName, []byte(text), 0755); err != nil {
		return err
	}

	// copy build folder
	dirName := filepath.Join(path, "build")
	if _, err := os.Stat(dirName); err != nil {
		os.MkdirAll(dirName, 0755)
	}

	sourceName = helper.MapPath("/build/ShadowEditor.js")
	destName = filepath.Join(path, "build", "ShadowEditor.js")
	if err := helper.CopyFile(sourceName, destName); err != nil {
		return err
	}

	// copy assets folder
	sourceName = helper.MapPath("/assets")
	destName = filepath.Join(path, "assets")
	if err := helper.CopyDirectory(sourceName, destName); err != nil {
		return err
	}

	// copy language pack
	sourceName = helper.MapPath("/lang")
	destName = filepath.Join(path, "lang")
	if err := helper.CopyDirectory(sourceName, destName); err != nil {
		return err
	}

	// copy website icon
	sourceName = helper.MapPath("/favicon.ico")
	destName = filepath.Join(path, "favicon.ico")
	return helper.CopyDirectory(sourceName, destName)
}
