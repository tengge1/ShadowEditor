package base

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Write write a string to http response
func Write(w http.ResponseWriter, args ...interface{}) {
	header := w.Header()

	EnableCrossOrigin(w)

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprintln(args...)))
}

// Writef write a string to http response
func Writef(w http.ResponseWriter, format string, args ...interface{}) {
	header := w.Header()

	EnableCrossOrigin(w)

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprintln(args...)))
}

// WriteJSON write a json to http response
func WriteJSON(w http.ResponseWriter, obj interface{}) error {
	header := w.Header()

	EnableCrossOrigin(w)

	header.Set("Content-Type", "application/json")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	bytes, err := json.Marshal(obj)
	if err != nil {
		return err
	}

	w.Write(bytes)

	return nil
}
