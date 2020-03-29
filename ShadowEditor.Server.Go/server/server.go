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
func Start() {
	log.Printf("starting shadoweditor server on port %v", helper.Config.Server.Port)

	err := http.ListenAndServe(helper.Config.Server.Port, NewRouter())
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
func NewRouter() *httptreemux.TreeMux {
	mux := httptreemux.New()
	mux.OptionsHandler = corsHandler

	group := mux.NewGroup("/")

	for _, route := range base.Routes {
		group.UsingContext().Handle("GET", route.Path, route.Handler)
	}

	return mux
}

func corsHandler(w http.ResponseWriter, r *http.Request, params map[string]string) {
	base.EnableCrossOrigin(w)
}

// Register register a handler
func Register(path string, handler http.HandlerFunc) {
	base.Register(path, handler)
}
