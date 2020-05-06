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

func exportUpload(path string) {
	dirName := filepath.Join(path, "api", "Upload")
	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		os.MkdirAll(dirName, 0755)
	}

	// other apis
	apiList := []string{
		"/api/Upload/Upload",
	}

	data, _ := helper.ToJSON(map[string]interface{}{
		"Code": 200,
		"Msg":  "Execute successfully!",
	})

	for _, i := range apiList {
		fileName := filepath.Join(path, i)
		ioutil.WriteFile(fileName, []byte(data), 0755)
	}
}
