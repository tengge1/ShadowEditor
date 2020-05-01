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
	"testing"
)

func TestGet(t *testing.T) {
	bytes, err := Get("http://www.baidu.com")
	if err != nil {
		t.Error(err)
		return
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
