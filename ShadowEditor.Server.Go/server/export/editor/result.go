package editor

import "github.com/tengge1/shadoweditor/server"

// Result is export editor result.
type Result struct {
	server.Result
	URL string `json:"Url"`
}
