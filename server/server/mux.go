// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"net/http"

	"github.com/dimfeld/httptreemux"

	"github.com/tengge1/shadoweditor/server/helper"
)

var (
	// Mux is used to register new route.
	// In the sub packages, we import the server package and can register route like:
	//
	// ```
	// import "github.com/tengge1/shadoweditor/server/server"
	//
	// func init() {
	//     server.Mux.UsingContext().Handle(http.MethodGet, "/api/Controller/Method", SomeFunc)
	// }
	//
	// func SomeFunc(w http.ResponseWriter, r *http.Request) {
	//     w.Write([]byte("Hello, world."))
	// }
	// ```
	Mux *httptreemux.TreeMux
)

func init() {
	mux := httptreemux.New()
	mux.OptionsHandler = corsHandler
	Mux = mux
}

func corsHandler(w http.ResponseWriter, r *http.Request, params map[string]string) {
	helper.EnableCrossDomain(w, r)
}
