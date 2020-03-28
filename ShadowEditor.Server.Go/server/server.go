package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dimfeld/httptreemux"
	"github.com/tengge1/shadoweditor/helper"
)

// Start start the server
func Start(config *helper.Config) {
	router := httptreemux.New()

	group := router.NewGroup("/api")
	group.GET("/v1/:id", func(w http.ResponseWriter, r *http.Request, params map[string]string) {
		id := params["id"]
		fmt.Fprintf(w, "GET /api/v1/%s", id)
	})

	// UsingContext returns a version of the router or group with context support.
	ctxGroup := group.UsingContext() // sibling to 'group' node in tree
	ctxGroup.GET("/v2/:id", func(w http.ResponseWriter, r *http.Request) {
		params := httptreemux.ContextParams(r.Context())
		id := params["id"]
		fmt.Fprintf(w, "GET /api/v2/%s", id)
	})

	log.Printf("starting shadoweditor server on port %v", config.Server.Port)

	http.ListenAndServe(config.Server.Port, router)
}
