package base

import "net/http"

var (
	// Routes all routes
	Routes []Route
)

// Route map a path to a HandlerFunc
type Route struct {
	Path    string
	Method  string
	Handler http.HandlerFunc
}

// Register register a route
func Register(path, method string, handler http.HandlerFunc) {
	Routes = append(Routes, Route{path, method, handler})
}
