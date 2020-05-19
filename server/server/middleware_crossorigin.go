// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"net/http"

	"github.com/tengge1/shadoweditor/helper"
)

// CrossOriginMiddleware add cross-origin header to the response.
//
// TODO: It may be dangerous not checking the origin.
func CrossOriginMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	helper.EnableCrossDomain(w, r)
	next.ServeHTTP(w, r)
}
