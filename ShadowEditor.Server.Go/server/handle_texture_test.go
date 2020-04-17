package server

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestTextureList(t *testing.T) {
	context.Create("../config.toml")

	texture := Texture{}

	ts := httptest.NewServer(http.HandlerFunc(texture.List))
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

func TestTextureEdit(t *testing.T) {
	context.Create("../config.toml")

	texture := Texture{}

	ts := httptest.NewServer(http.HandlerFunc(texture.Edit))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID":       {"5e9996894a8c40e5755b5e0a"},
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
