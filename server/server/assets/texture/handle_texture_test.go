// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package texture

import (
	"bytes"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"testing"

	"github.com/prometheus/common/log"
	"github.com/tengge1/shadoweditor/server"
)

func TestTextureList(t *testing.T) {
	server.Create("../config.toml")

	ts := httptest.NewServer(http.HandlerFunc(List))
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

	t.Log(string(bytes))
}

func TestTextureAdd(t *testing.T) {
	server.Create("../config.toml")

	ts := httptest.NewServer(http.HandlerFunc(Add))
	defer ts.Close()

	bodyBuffer := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuffer)

	name := "TestTextureAdd" + ".jpg"
	path := "../../ShadowEditor.Web/assets/textures/air.jpg"

	fileWriter, err := bodyWriter.CreateFormFile("file", name)
	if err != nil {
		log.Error(err)
		return
	}

	file, err := os.Open(path)
	if err != nil {
		log.Error(err)
		return
	}
	defer file.Close()

	io.Copy(fileWriter, file)

	contentType := bodyWriter.FormDataContentType()
	bodyWriter.Close()

	res, err := http.Post(ts.URL, contentType, bodyBuffer)
	if err != nil {
		t.Error(err)
		return
	}
	defer res.Body.Close()

	byts, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Error(err)
		return
	}

	t.Log(string(byts))
}

func TestTextureEdit(t *testing.T) {
	server.Create("../config.toml")

	ts := httptest.NewServer(http.HandlerFunc(Edit))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID":       {"5e9996894a8c40e5755b5e09"},
		"Name":     {"TestTextureEdit"},
		"Category": {"5c14b3a7c8b49a33c4845ba1"},
	})
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

	t.Log(string(bytes))
}

func TestTextureDelete(t *testing.T) {
	server.Create("../config.toml")

	ts := httptest.NewServer(http.HandlerFunc(Delete))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID": {"5e9996894a8c40e5755b5e09"},
	})
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

	t.Log(string(bytes))
}
