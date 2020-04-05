package base

import (
	"net/http"
	"testing"
)

func TestRouter(t *testing.T) {
	Register("foo", http.MethodGet, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("foo"))
	}))
	Register("bar", http.MethodPost, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		name := r.FormValue("name")
		w.Write([]byte("Hello," + name))
	}))

	for _, route := range Routes {
		t.Logf("Path: %v\tMathod: %v\t", route.Path, route.Method)
	}
}
