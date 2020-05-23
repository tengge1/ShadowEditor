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

// ValidateTokenMiddleware is used to validate user's credentials.
func ValidateTokenMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	if !Config.Authority.Enabled { // authority is not enabled
		next(w, r)
		return
	}

	auth := apiAuthorities[r.URL.Path]

	// api needs no authority
	if auth == None {
		next(w, r)
		return
	}

	// check whether user has the authority required
	user, _ := GetCurrentUser(r)

	has := false
	for _, item := range user.OperatingAuthorities {
		if item == string(auth) {
			has = true
			break
		}
	}

	if has {
		next(w, r)
		return
	}

	// user has no authority
	result := Result{
		Code: 301,
		Msg:  "Not allowed.",
	}

	json, _ := helper.ToJSON(result)
	w.Write(json)
}
