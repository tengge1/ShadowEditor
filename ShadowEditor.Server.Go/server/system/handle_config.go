package system

import (
	"net/http"

	"github.com/tengge1/shadoweditor/server/router"
)

func init() {
	config := Config{}
	router.Register("/api/Config/List", config.List)
}

type Config struct {
}

func (a Config) List(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello, config!"))
}
