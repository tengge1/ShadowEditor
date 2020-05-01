// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"io/ioutil"
	"testing"
)

func TestUnZip(t *testing.T) {
	file := "../test/test.zip"
	tmp, err := ioutil.TempDir("/tmp", "unzip")
	if err != nil {
		t.Error(err)
	}
	err = UnZip(file, tmp)
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(tmp)
}
