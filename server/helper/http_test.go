// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strconv"
	"strings"
	"testing"
)

func TestEnableCrossDomain(t *testing.T) {
	origin := "http://192.168.0.2"

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("Origin", origin) // Header is case insensitive, `Origin` or `origin` is ok.
		EnableCrossDomain(w, r)
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

func TestGet(t *testing.T) {
	bytes, err := Get("http://www.baidu.com")
	if err != nil {
		t.Error(err)
	}
	t.Log(string(bytes))
}

func TestPost(t *testing.T) {
	bytes, err := Post("https://passport.baidu.com/v2/api/?login", url.Values{"username": {"foo"}, "password": {"bar"}})
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(string(bytes))
}

func TestWrite(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Write(w, "hello")
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
		return
	}

	if string(bytes) != "hello" {
		t.Errorf("expect `hello`, get `%v`", string(bytes))
	}
}

func TestWritef(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Writef(w, "%v", "hello")
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()

	bytes, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
		return
	}

	if string(bytes) != "hello" {
		t.Errorf("expect `hello`, get `%v`", string(bytes))
	}
}

func TestWriteJSON(t *testing.T) {
	person := Person{"xiaoming", 20}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		WriteJSON(w, person)
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()

	result := Person{}

	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&result)
	if err != nil {
		t.Error("json decode failed")
		return
	}

	if result.Name != "xiaoming" {
		t.Errorf("write: expect `xiaoming`, get `%v`", result.Name)
	}
	if result.Age != 20 {
		t.Errorf("write: expect `20`, get `%v`", result.Age)
	}
}

func TestDownload(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Download(w, "./download.go", "下载")
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
		return
	}
	strlen := res.Header.Get("Content-Length")

	t.Logf("Content-Disposition: %v", res.Header.Get("Content-Disposition"))
	t.Logf("Content-Length: %v", strlen)
	t.Logf("Content-Type: %v", res.Header.Get("Content-Type"))

	stat, err := os.Stat("./download.go")
	if err != nil {
		t.Error(err)
		return
	}

	size := int(stat.Size())
	length, _ := strconv.Atoi(strlen)

	if size != length {
		t.Errorf("size should be %v, get %v", size, length)
	}
}
