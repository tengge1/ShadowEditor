package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
	"time"

	"github.com/tengge1/shadoweditor/helper"

	"github.com/tengge1/shadoweditor/context"
)

func TestUserList(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	user := User{}

	ts := httptest.NewServer(http.HandlerFunc(user.List))
	defer ts.Close()

	res, err := http.Get(ts.URL + "?keyword=ad")
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

func TestUserAdd(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

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

func TestUserEdit(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

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

func TestUserDelete(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

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
