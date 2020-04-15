package server

import (
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestStart(t *testing.T) {
	context.Create("../config.toml")
	// port := context.Config.Server.Port
	go Start()
}
