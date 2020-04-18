package department

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/tengge1/shadoweditor/server"
)

func TestDepartmentList(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

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
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

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

func TestDepartmentEdit(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	department := Department{}

	ts := httptest.NewServer(http.HandlerFunc(department.Edit))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID":       {"5e8b108e4e430fddd3b1e56f"},
		"ParentID": {"5dd3fecb4859d038303b26be"},
		"Name":     {"TestDept2"},
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

func TestDepartmentDelete(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	department := Department{}

	ts := httptest.NewServer(http.HandlerFunc(department.Delete))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID": {"5e8b108e4e430fddd3b1e56f"},
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
