// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import "testing"

func TestMD5(t *testing.T) {
	str := "The fog is getting thicker!"
	result := MD5(str)
	if result != "bd009e4d93affc7c69101d2e0ec4bfde" {
		t.Errorf("md5: expect bd009e4d93affc7c69101d2e0ec4bfde, got %v", result)
	}
}
