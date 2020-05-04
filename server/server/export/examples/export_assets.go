// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package examples

import (
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/tengge1/shadoweditor/helper"
)

func exportAssets(path string) {
	dirName := filepath.Join(path, "api", "Assets")

	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		os.MkdirAll(dirName, 0755)
	}

	// 获取列表
	fileName := filepath.Join(path, "api", "Assets", "List")
	data, _ := helper.ToJSON(map[string]interface{}{
		"Code":           200,
		"Msg":            "Export sucessfully",
		"sceneCount":     32,
		"meshCount":      2469,
		"mapCount":       674,
		"materialCount":  12,
		"audioCount":     19,
		"animationCount": 8,
		"particleCount":  0,
		"prefabCount":    0,
		"characterCount": 0,
	})

	ioutil.WriteFile(fileName, []byte(data), 0755)
}
