// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

// Download write a file stream to the response.
func Download(w http.ResponseWriter, path, name string) {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte(err.Error()))
		return
	}

	header := w.Header()
	header.Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%v"`, url.QueryEscape(name)))
	header.Set("Content-Length", strconv.Itoa(len(bytes)))
	header.Set("Content-Type", "application/octet-stream; charset=GB2312")
	w.Write(bytes)
}
