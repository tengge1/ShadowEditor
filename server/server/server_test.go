// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestMux(t *testing.T) {
	hello := "Hello, world!"
	path := "/hello"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}
	mux.UsingContext().Handle(http.MethodGet, path, handler)

	ts := httptest.NewServer(mux)
	defer ts.Close()

	res, err := http.Get(ts.URL + path)
	if err != nil {
		t.Error(err)
	}
	defer res.Body.Close()

	byts, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
	}

	str := string(byts)
	if str != hello {
		t.Errorf("expect %v, got %v", hello, str)
	}
}

func TestStart(t *testing.T) {
	// TODO: We CAN NOT test Start function here, and it may need reconstruct.
	//
	// if err := Create("../config.toml"); err != nil {
	// 	t.Error(err)
	// }

	// hello := "Hello, world!"
	// path := "/hello"
	// handler := func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte(hello))
	// }
	// Handle(http.MethodGet, path, handler, SaveScene)

	// Start()

	// res, err := http.Get("http://127.0.0.1" + Config.Server.Port + path)
	// if err != nil {
	// 	t.Error(err)
	// }
	// defer res.Body.Close()

	// byts, err := ioutil.ReadAll(res.Body)
	// if err != nil {
	// 	t.Error(err)
	// }

	// str := string(byts)
	// if str != hello {
	// 	t.Errorf("expect %v, got %v", hello, str)
	// }
}

func TestHandle(t *testing.T) {
	hello := "Hello, world!"
	path := "/hello"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}
	Handle(http.MethodGet, path, handler, SaveScene)

	auth, ok := apiAuthorities[path]
	if !ok {
		t.Error(fmt.Errorf("%v is not registered", path))
	}
	if auth != SaveScene {
		t.Errorf("expect %v, got %v", SaveScene, auth)
	}

	ts := httptest.NewServer(mux)
	defer ts.Close()

	res, err := http.Get(ts.URL + path)
	if err != nil {
		t.Error(err)
	}
	defer res.Body.Close()

	byts, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
	}

	str := string(byts)
	if str != hello {
		t.Errorf("expect %v, got %v", hello, str)
	}
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
