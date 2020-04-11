package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestOperatingAuthorityGet(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	authority := OperatingAuthority{}

	ts := httptest.NewServer(http.HandlerFunc(authority.Get))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"roleID": {"5dd101a84859d02218efef81"},
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

func TestOperatingAuthoritySave(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	authority := OperatingAuthority{}

	ts := httptest.NewServer(http.HandlerFunc(authority.Save))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"RoleID":      {"5dd101a84859d02218efef80"},
		"Authorities": {"LIST_MESH", "LIST_SCENE"},
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
