// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package login

import (
	"net/http"
	"time"

	"github.com/tengge1/shadoweditor/server/helper"
	"github.com/tengge1/shadoweditor/server/server"
)

func init() {
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Login/Logout", Logout)
}

// Logout log out the system.
func Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("UserID")
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}
	cookie.Expires = time.Now().AddDate(0, 0, -1)
	cookie.HttpOnly = true
	cookie.Path = "/"
	cookie.SameSite = http.SameSiteDefaultMode
	http.SetCookie(w, cookie)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Logout Successfully!",
	})
}
