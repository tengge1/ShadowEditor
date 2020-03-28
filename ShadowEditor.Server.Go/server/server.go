package server

import (
	"fmt"
	"net/http"

	"github.com/dimfeld/httptreemux"
)

// Start 启动服务端
func Start(port int) {
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

	http.ListenAndServe(":8080", router)
}
