package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestRoleList(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	role := Role{}

	ts := httptest.NewServer(http.HandlerFunc(role.List))
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
