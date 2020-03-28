package router

import "net/http"

var (
	// Handlers all routes
	Handlers []Handler
)

// Handler map a route to a HandlerFunc
type Handler struct {
	Path    string
	Handler http.HandlerFunc
}

// Register register a route
func Register(path string, handler http.HandlerFunc) {
	Handlers = append(Handlers, Handler{path, handler})
}
