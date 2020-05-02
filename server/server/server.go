// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"log"
	"net/http"

	"github.com/urfave/negroni"
)

// Start start the server
func Start() {
	log.Printf("starting shadoweditor server on port %v", Config.Server.Port)

	handler := negroni.Classic()
	handler.Use(negroni.HandlerFunc(CrossOriginHandler))
	handler.Use(negroni.HandlerFunc(GZipHandler))
	handler.Use(negroni.HandlerFunc(StaticHandler))
	handler.UseHandler(Mux)

	err := http.ListenAndServe(Config.Server.Port, handler)
	if err != nil {
		switch err {
		case http.ErrServerClosed:
			log.Panicln("http server closed")
		default:
			log.Fatal(err)
		}
	}
}
