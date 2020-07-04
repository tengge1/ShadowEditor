// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package gis

import (
	"fmt"
	"image/jpeg"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandleBing(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(HandleBing))
	defer ts.Close()
	// get response
	url := fmt.Sprintf("%v?x=108174&y=51164&z=17", ts.URL)
	resp, err := http.Get(url)
	if err != nil {
		t.Error(err)
	}
	typ := resp.Header.Get("Content-Type")
	if typ != "image/jpeg" {
		t.Errorf("expect image/jpeg, got %v", typ)
	}
	defer resp.Body.Close()

	if _, err := jpeg.Decode(resp.Body); err != nil {
		t.Error(err)
	}
}
