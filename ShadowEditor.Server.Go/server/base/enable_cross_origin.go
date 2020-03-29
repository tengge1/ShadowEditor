package base

import "net/http"

// EnableCrossOrigin enable cross origin
func EnableCrossOrigin(w http.ResponseWriter) {
	header := w.Header()

	header.Set("Access-Control-Allow-Origin", "*")
	header.Set("Access-Control-Allow-Methods", "HEAD, GET, POST, OPTIONS")
}
