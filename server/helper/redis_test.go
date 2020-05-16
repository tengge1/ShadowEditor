// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import "testing"

func TestRedis(t *testing.T) {
	redis := Redis{}.Create("localhost:6379", 0)

	redis.Set("foo", []byte("bar"))

	bytes, hit := redis.Get("foo")
	if !hit {
		t.Error("redis not hit")
		return
	}

	result := string(bytes)
	if result != "bar" {
		t.Errorf("expect bar, %v get", result)
	}
}
