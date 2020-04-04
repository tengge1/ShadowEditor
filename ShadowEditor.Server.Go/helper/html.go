package helper

import (
	"net/http"
)

// EnableCrossDomain enable cross domain
func EnableCrossDomain(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")

	header := w.Header()
	header.Set("Access-Control-Allow-Methods", "OPTIONS,POST,GET")

	if origin == "" { // not cross origin
		header.Set("Access-Control-Allow-Origin", "*")
	} else {
		header.Set("Access-Control-Allow-Origin", origin)
	}
}
