package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestInitialize(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	initialize := Initialize{}

	ts := httptest.NewServer(http.HandlerFunc(initialize.Initialize))
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
