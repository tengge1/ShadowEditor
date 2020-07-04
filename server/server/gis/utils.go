// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package gis

import (
	"net/http"
	"strconv"
)

// writeByts writes bytes to the response.
func writeByts(w http.ResponseWriter, contentType string, byts []byte) {
	header := w.Header()
	header.Set("Content-Length", strconv.Itoa(len(byts)))
	header.Set("Content-Type", contentType)
	w.WriteHeader(http.StatusOK)
	w.Write(byts)
}
