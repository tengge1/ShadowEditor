package server

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestCategoryList(t *testing.T) {
	context.Create("../config.toml")

	category := Category{}

	ts := httptest.NewServer(http.HandlerFunc(category.List))
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
