package server

import (
	"net/http"

	"github.com/dimfeld/httptreemux"

	"github.com/tengge1/shadoweditor/helper"
)

var (
	// Mux is a tree mux.
	Mux *httptreemux.TreeMux
)

func init() {
	mux := httptreemux.New()
	mux.OptionsHandler = corsHandler
	Mux = mux
}

func corsHandler(w http.ResponseWriter, r *http.Request, params map[string]string) {
	helper.EnableCrossDomain(w, r)
}
