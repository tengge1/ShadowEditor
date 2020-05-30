// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import "testing"

func TestGetCurrentUser(t *testing.T) {

}

func TestGetUser(t *testing.T) {
	if err := Create("../config.toml"); err != nil {
		t.Error(err)
	}

	admin, err := GetUser("5dd101a84859d02218efef84")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(admin)

	user, err := GetUser("5dd108e64859d222181f0397")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(user)
}
