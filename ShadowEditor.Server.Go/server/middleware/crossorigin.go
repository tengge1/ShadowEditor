package middleware

import (
	"net/http"

	"github.com/tengge1/shadoweditor/helper"
)

// CrossOriginHandler is responsible for cross origin.
func CrossOriginHandler(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	helper.EnableCrossDomain(w, r)
	next.ServeHTTP(w, r)
}
