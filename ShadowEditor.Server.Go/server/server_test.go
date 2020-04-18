package server

import (
	"testing"
)

func TestStart(t *testing.T) {
	Create("../config.toml")
	// port := Config.Server.Port
	go Start()
}
