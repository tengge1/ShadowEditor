// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package middleware

import (
	"io/ioutil"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/tengge1/shadoweditor/helper"
)

// StaticHandler is responsible for serve static contents.
func StaticHandler(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	if strings.HasPrefix(r.URL.Path, "/api") { // api controller
		next.ServeHTTP(w, r)
		return
	}

	// TODO: 可能有安全风险。

	// static contents
	path := helper.MapPath("/") + r.URL.Path

	if strings.HasSuffix(path, "/") {
		path += "index.html"
	}

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	file, err := os.Open(path)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", mime.TypeByExtension(filepath.Ext(path)))
	w.Write(bytes)
}
