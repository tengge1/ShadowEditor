// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package user

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func TestUserList(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(List))
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
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(Add))
	defer ts.Close()

	userName := helper.TimeToString(time.Now(), "mmss")

	res, err := http.PostForm(ts.URL, url.Values{
		"Username": {"user-" + userName},
		"Password": {"123"},
		"Name":     {"User " + userName},
		"RoleID":   {"5dd101a84859d02218efef80"},
		"DeptID":   {"5dd3fec44859d038303b26bc"},
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
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(Edit))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID":       {"5e927a545d749efc3065fae7"},
		"Username": {"1"},
		"Name":     {"3"},
		"RoleID":   {"5dd101a84859d02218efef80"},
		"DeptID":   {"5dd3fec44859d038303b26bc"},
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
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(Delete))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"ID": {"5e927a545d749efc3065fae7"},
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

func TestUserChangePassword(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(ChangePassword))
	defer ts.Close()

	params := url.Values{
		"OldPassword":     {"123"},
		"NewPassword":     {"456"},
		"ConfirmPassword": {"456"},
	}

	req, err := http.NewRequest(http.MethodPost, ts.URL, strings.NewReader(params.Encode()))
	if err != nil {
		t.Error(err)
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	cookie := http.Cookie{Name: ".ASPXAUTH", Value: "5e927a545d749efc3065fae7"}
	req.AddCookie(&cookie)

	res, err := ts.Client().Do(req)
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

func TestUserResetPassword(t *testing.T) {
	server.Create("../../config.toml")
	server.Config.Authority.Enabled = true

	ts := httptest.NewServer(http.HandlerFunc(ResetPassword))
	defer ts.Close()

	res, err := http.PostForm(ts.URL, url.Values{
		"UserID":          {"5e927a545d749efc3065fae7"},
		"NewPassword":     {"456"},
		"ConfirmPassword": {"456"},
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
