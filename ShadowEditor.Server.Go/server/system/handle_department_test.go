package system

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/context"
)

func TestDepartmentList(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	department := Department{}

	ts := httptest.NewServer(http.HandlerFunc(department.List))
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

func TestDepartmentAdd(t *testing.T) {
	context.Create("../../config.toml")
	context.Config.Authority.Enabled = true

	department := Department{}

	ts := httptest.NewServer(http.HandlerFunc(department.Add))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ParentID": {""},
		"Name":     {"TestDept"},
		"AdminID":  {""},
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
