package animation

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func TestAnimationList(t *testing.T) {
	server.Create("../config.toml")

	animation := Animation{}

	ts := httptest.NewServer(http.HandlerFunc(animation.List))
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

func TestAnimationAdd(t *testing.T) {
	server.Create("../config.toml")

	animation := Animation{}

	ts := httptest.NewServer(http.HandlerFunc(animation.Add))
	defer ts.Close()

	roleName := helper.TimeToString(time.Now(), "mmss")

	res, err := http.PostForm(ts.URL, url.Values{
		"Name":        {"role-" + roleName},
		"Description": {"role-" + roleName + " Description"},
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

func TestAnimationEdit(t *testing.T) {
	server.Create("../config.toml")

	animation := Animation{}

	ts := httptest.NewServer(http.HandlerFunc(animation.Edit))
	defer ts.Close()

	roleName := helper.TimeToString(time.Now(), "mmss")

	res, err := http.PostForm(ts.URL, url.Values{
		"ID":          {"5e9267a43003597156ac49a0"},
		"Name":        {"role-" + roleName},
		"Description": {"role-" + roleName + " Description"},
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

func TestAnimationDelete(t *testing.T) {
	server.Create("../config.toml")

	animation := Animation{}

	ts := httptest.NewServer(http.HandlerFunc(animation.Delete))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID": {"5e9267a43003597156ac49a0"},
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
