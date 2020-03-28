package server

import (
	"log"
	"net/http"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/helper"
)

// Handler map a path to a HandlerFunc
type Handler struct {
	Path    string
	Handler http.HandlerFunc
}

var (
	// Handlers are registered by Register function
	Handlers []Handler
)

// Start start the server
func Start(config *helper.Config) {
	log.Printf("starting shadoweditor server on port %v", config.Server.Port)

	err := http.ListenAndServe(config.Server.Port, NewRouter())
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
func NewRouter() *httptreemux.TreeMux {
	mux := httptreemux.New()
	group := mux.NewGroup("/")

	for _, handler := range Handlers {
		group.UsingContext().Handle("GET", handler.Path, handler.Handler)
	}

	return mux
}

// Register register a handler
func Register(path string, handler http.HandlerFunc) {
	Handlers = append(Handlers, Handler{path, handler})
}
