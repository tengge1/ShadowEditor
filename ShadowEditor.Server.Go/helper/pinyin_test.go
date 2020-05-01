// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import "testing"

func TestConvertToPinYin(t *testing.T) {
	text := "中国人"
	pinyin := ConvertToPinYin(text)

	if pinyin.FirstPinYin != "zgr" {
		t.Errorf("first pinyin should be `zgr`, get `%v`", pinyin.FirstPinYin)
		return
	}

	if pinyin.TotalPinYin != "zhongguoren" {
		t.Errorf("first pinyin should be `zhongguoren`, get `%v`", pinyin.TotalPinYin)
		return
	}

	t.Log(pinyin)
}
