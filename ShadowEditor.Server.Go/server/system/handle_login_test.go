package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestLogin(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	login := Login{}

	ts := httptest.NewServer(http.HandlerFunc(login.Login))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"Username": {"admin"},
		"Password": {"123456"},
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

func TestLogout(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	login := Login{}

	ts := httptest.NewServer(http.HandlerFunc(login.Logout))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{})
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
