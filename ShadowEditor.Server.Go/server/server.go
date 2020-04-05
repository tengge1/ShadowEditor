package server

import (
	"log"
	"net/http"

	"github.com/tengge1/shadoweditor/helper"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/server/base"
	_ "github.com/tengge1/shadoweditor/server/export" // export apis
	_ "github.com/tengge1/shadoweditor/server/system" // system apis
	_ "github.com/tengge1/shadoweditor/server/tools"  // tools apis
)

// Start start the server
func Start() {
	log.Printf("starting shadoweditor server on port %v", context.Config.Server.Port)

	err := http.ListenAndServe(context.Config.Server.Port, NewRouter())
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
		group.UsingContext().Handler("GET", route.Path, SetDefaultHeaders(route.Handler))
	}

	return mux
}

func corsHandler(w http.ResponseWriter, r *http.Request, params map[string]string) {
	helper.EnableCrossDomain(w, r)
}

// SetDefaultHeaders set cross origin response headers
func SetDefaultHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		helper.EnableCrossDomain(w, r)
		next.ServeHTTP(w, r)
	})
}

// Register register a handler
func Register(path string, handler http.HandlerFunc) {
	base.Register(path, handler)
}
