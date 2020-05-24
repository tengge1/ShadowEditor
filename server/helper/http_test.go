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
		if _, err := Write(w, "hello"); err != nil {
			t.Error(err)
		}
	}))
	defer ts.Close()

	bytes, err := Get(ts.URL)
	if err != nil {
		t.Error(err)
	}

	if string(bytes) != "hello" {
		t.Errorf("expect hello, got %v", string(bytes))
	}
}

func TestWritef(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := Writef(w, "%v", "hello"); err != nil {
			t.Error(err)
		}
	}))
	defer ts.Close()

	bytes, err := Get(ts.URL)
	if err != nil {
		t.Error(err)
	}

	if string(bytes) != "hello" {
		t.Errorf("expect hello, got %v", string(bytes))
	}
}

func TestWriteJSON(t *testing.T) {
	person := Person{"xiaoming", 20}

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := WriteJSON(w, person); err != nil {
			t.Error(err)
		}
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}
	defer res.Body.Close()

	result := Person{}

	decoder := json.NewDecoder(res.Body)
	if err = decoder.Decode(&result); err != nil {
		t.Error("json decode failed")
	}
	if result.Name != "xiaoming" {
		t.Errorf("write: expect xiaoming, got %v", result.Name)
	}
	if result.Age != 20 {
		t.Errorf("write: expect 20, got %v", result.Age)
	}
}

func TestWriteFile(t *testing.T) {
	str := "hello, world!"

	// create a temp file
	file, err := ioutil.TempFile(os.TempDir(), "*.txt")
	if err != nil {
		t.Error(err)
	}
	file.Write([]byte(str))
	file.Close()

	// download file
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := WriteFile(w, file.Name(), "test.txt"); err != nil {
			t.Error(err)
		}
	}))
	defer ts.Close()

	res, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}

	disposition := res.Header.Get("Content-Disposition")
	length := res.Header.Get("Content-Length")
	typ := res.Header.Get("Content-Type")

	expected := `attachment; filename="test.txt"`
	if disposition != expected {
		t.Errorf("expect %v, got %v", expected, disposition)
	}

	expected = strconv.Itoa(len(str))
	if length != expected {
		t.Errorf("expect %v, got %v", expected, length)
	}

	expected = "application/octet-stream; charset=GB2312"
	if typ != expected {
		t.Errorf("expect %v, got %v", expected, typ)
	}
}
