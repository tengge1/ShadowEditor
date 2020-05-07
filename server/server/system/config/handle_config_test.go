// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

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

	ts := httptest.NewServer(http.HandlerFunc(Get))
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

	ts := httptest.NewServer(http.HandlerFunc(Get))
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

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Get(w, r)
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
