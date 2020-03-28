package server

import (
	"log"
	"net/http"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server/base"
	_ "github.com/tengge1/shadoweditor/server/export" // export apis
	_ "github.com/tengge1/shadoweditor/server/system" // system apis
	_ "github.com/tengge1/shadoweditor/server/tools"  // tools apis
)

// Start start the server
func Start(config *helper.Config) {
	log.Printf("starting shadoweditor server on port %v", config.Server.Port)

	err := http.ListenAndServe(config.Server.Port, NewRouter(config))
	if err != nil {
		switch err {
		case http.ErrServerClosed:
			log.Panicln("http server closed")
		default:
			log.Fatal(err)
		}
	}
}

// NewRouter handle all register routes
func NewRouter(config *helper.Config) *httptreemux.TreeMux {
	mux := httptreemux.New()
	group := mux.NewGroup("/")

	for _, handler := range base.Routes {
		group.UsingContext().Handle("GET", handler.Path, handler.Handler{config})
	}

	return mux
}

// Register register a handler
func Register(path string, handler http.HandlerFunc) {
	base.Register(path, handler)
}
