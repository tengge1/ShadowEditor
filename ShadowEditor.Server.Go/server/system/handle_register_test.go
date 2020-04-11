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

func TestRegister(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	register := Register{}

	ts := httptest.NewServer(http.HandlerFunc(register.Register))
	defer ts.Close()

	now := helper.TimeToString(time.Now(), "mmss")

	res, err := http.PostForm(ts.URL, url.Values{
		"Username":        {"user-" + now},
		"Password":        {"123"},
		"ConfirmPassword": {"123"},
		"Name":            {"User" + now},
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
