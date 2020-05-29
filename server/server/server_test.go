// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestMux(t *testing.T) {

}

func TestStart(t *testing.T) {
	Create("../config.toml")
	// port := Config.Server.Port
	go Start()
}

func TestHandle(t *testing.T) {

}

func TestCORSHandler(t *testing.T) {
	origin := "http://192.168.0.2"

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Origin", origin) // Header is case insensitive, `Origin` or `origin` is ok.
		corsHandler(w, r, map[string]string{})
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}

	methodsHeader := res.Header.Get("Access-Control-Allow-Methods")
	originHeader := res.Header.Get("Access-Control-Allow-Origin")

	if methodsHeader == "" ||
		!strings.Contains(methodsHeader, "OPTIONS") ||
		!strings.Contains(methodsHeader, "POST") ||
		!strings.Contains(methodsHeader, "GET") {
		t.Errorf("Access-Control-Allow-Methods is not set properly, got %v", methodsHeader)
	}

	if originHeader != origin {
		t.Errorf("Access-Control-Allow-Origin is not set properly, got %v", originHeader)
	}
}
