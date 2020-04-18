package config

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/tengge1/shadoweditor/server"
)

func TestHandleConfigNoAuthority(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = false

	config := Config{}

	ts := httptest.NewServer(http.HandlerFunc(config.Get))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()
	io.Copy(os.Stdout, res.Body)
}

func TestHandleConfigNotLogin(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	config := Config{}

	ts := httptest.NewServer(http.HandlerFunc(config.Get))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()
	io.Copy(os.Stdout, res.Body)
}

func TestHandleConfigLoginAdmin(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	config := Config{}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		config.Get(w, r)
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()
	io.Copy(os.Stdout, res.Body)
}
