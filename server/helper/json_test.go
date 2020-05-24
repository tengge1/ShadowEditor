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
			123.4, // float64
		},
		"time": time.Date(2020, 4, 27, 20, 34, 10, 0, time.Local),
		"id":   id,
		"d":    primitiveD,
	}

	// ToJSON
	bytes, err := ToJSON(obj)
	if err != nil {
		t.Error(err)
	}

	// FromJSON
	result := map[string]interface{}{}
	if err := FromJSON(bytes, &result); err != nil {
		t.Error(err)
	}

	foo := int(result["foo"].(float64))
	if foo != 1 {
		t.Errorf("expect 1, got %v", foo)
	}

	bar := result["bar"].([]interface{})

	bar1 := bar[0].(string)
	if bar1 != "hello" {
		t.Errorf("expect hello, got %v", bar1)
	}

	bar2 := bar[1].(float64)
	if bar2 != 123.4 {
		t.Errorf("expect 123.4, got %v", bar2)
	}

	time := result["time"].(string)
	if time != "2020-04-27 20:34:10" {
		t.Errorf("expect 2020-04-27 20:34:10, got %v", time)
	}

	id2 := result["id"].(string)
	if id2 != id.Hex() {
		t.Errorf("expect %v, got %v", id.Hex(), id2)
	}

	dd := result["d"].(map[string]interface{})

	ddFoo := dd["foo"].(string)
	if ddFoo != "bar" {
		t.Errorf("expect bar, got %v", ddFoo)
	}

	ddHello := dd["hello"].(string)
	if ddHello != "world" {
		t.Errorf("expect world, got %v", ddHello)
	}
}
