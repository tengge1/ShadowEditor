package role

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

func TestRoleList(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	role := Role{}

	ts := httptest.NewServer(http.HandlerFunc(role.List))
	defer ts.Close()

	res, err := http.Get(ts.URL + "?keyword=us")
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

func TestRoleAdd(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	role := Role{}

	ts := httptest.NewServer(http.HandlerFunc(role.Add))
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

func TestRoleEdit(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	role := Role{}

	ts := httptest.NewServer(http.HandlerFunc(role.Edit))
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

func TestRoleDelete(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	role := Role{}

	ts := httptest.NewServer(http.HandlerFunc(role.Delete))
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
