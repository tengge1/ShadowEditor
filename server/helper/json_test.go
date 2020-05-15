// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestJSON(t *testing.T) {
	id, _ := primitive.ObjectIDFromHex("5ea82000e8cbe4f02f0259ab")
	primitiveD := primitive.D{
		{Key: "foo", Value: "bar"},
		{Key: "hello", Value: "world"},
	}

	obj := map[string]interface{}{
		"foo": 1, // float64
		"bar": []interface{}{
			"hello",
			123, // float64
		},
		"time": time.Date(2020, 4, 27, 20, 34, 10, 0, time.Local),
		"id":   id,
		"d":    primitiveD,
	}

	bytes := ToJSON(obj)

	t.Log(string(bytes))
}
