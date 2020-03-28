package server

import (
	"log"
	"net/http"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/helper"
	_ "github.com/tengge1/shadoweditor/server/export" // export apis
	"github.com/tengge1/shadoweditor/server/router"
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

// NewRouter handle all register handlers
func NewRouter(config *helper.Config) *httptreemux.TreeMux {
	mux := httptreemux.New()
	group := mux.NewGroup("/")

	for _, handler := range router.Handlers {
		group.UsingContext().Handle("GET", handler.Path, handler.Handler)
	}

	return mux
}

// Register register a handler
func Register(path string, handler http.HandlerFunc) {
	router.Register(path, handler)
}
