// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package editor

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/tengge1/shadoweditor/helper"

	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/ExportEditor/Run", Run)
}

// Run 导出编辑器
func Run(w http.ResponseWriter, r *http.Request) {
	now := time.Now()

	path := helper.MapPath(fmt.Sprintf("/temp/%v", helper.TimeToString(now, "yyyyMMddHHmmss")))

	if _, err := os.Stat(path); os.IsNotExist(err) {
		os.MkdirAll(path, 0755)
	}

	CopyAssets(path)
	CreateDataFile(path)

	result := Result{}
	result.Code = 200
	result.Msg = "Export successfully!"
	result.URL = fmt.Sprintf("/temp/%v/editor.html", helper.TimeToString(now, "yyyyMMddHHmmss"))

	helper.WriteJSON(w, result)
}
