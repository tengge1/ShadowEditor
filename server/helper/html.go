// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"net/http"
)

// EnableCrossDomain enables cross domain.
// It set the `Access-Control-Allow-Methods` header and the
// `Access-Control-Allow-Origin` header.
//
// TODO: We should restrict the origin, and may config in `config.toml`.
func EnableCrossDomain(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")

	header := w.Header()
	header.Set("Access-Control-Allow-Methods", "OPTIONS,POST,GET")

	if origin == "" { // not cross origin
		header.Set("Access-Control-Allow-Origin", "*")
	} else {
		header.Set("Access-Control-Allow-Origin", origin)
	}
}
