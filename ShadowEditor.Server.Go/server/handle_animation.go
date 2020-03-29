package server

import "net/http"

func init() {
	// animation := Animation{}
	// Register("/api/Animation/List", animation.List)
}

type Animation struct {
}

func (a Animation) List(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, world!"))
}
