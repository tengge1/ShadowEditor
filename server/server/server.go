// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/urfave/negroni"
)

// Start start the web server.
//
// Negroni is an idiomatic HTTP Middleware for Golang. `negroni.Classic` add three
// middleware: Recovery, Logger, Static. We add two: CrossOriginHandler, GZipHandler.
//
// Then, we use `httptreemux` to map route to the handler.
func Start() {
	log.Printf("starting shadoweditor server on port %v", Config.Server.Port)

	recovery := negroni.NewRecovery()
	logger := negroni.NewLogger()
	static := negroni.NewStatic(http.Dir("public"))

	handler := negroni.New(recovery, logger, static)
	handler.Use(negroni.HandlerFunc(CrossOriginMiddleware))
	handler.Use(negroni.HandlerFunc(GZipMiddleware))
	handler.Use(negroni.HandlerFunc(ValidateTokenMiddleware))
	handler.UseHandler(Mux)

	srv := http.Server{Addr: Config.Server.Port, Handler: handler}
	idleConnsClosed := make(chan struct{})

	go func() {
		sigint := make(chan os.Signal, 1)
		signal.Notify(sigint, os.Interrupt)
		<-sigint

		// We received an interrupt signal, shut down.
		if err := srv.Shutdown(context.Background()); err != nil {
			// Error from closing listeners, or context timeout.
			log.Printf("HTTP server Shutdown: %v", err)
		}
		close(idleConnsClosed)
	}()

	if err := srv.ListenAndServe(); err != http.ErrServerClosed {
		// Error starting or closing listener:
		log.Printf("HTTP server ListenAndServe: %v", err)
	}

	<-idleConnsClosed
}
