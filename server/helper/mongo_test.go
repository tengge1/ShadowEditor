// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"testing"

	"go.mongodb.org/mongo-driver/bson"
)

func TestMongo(t *testing.T) {
	config := GetConfig("../config.toml")
	db := NewMongo(config.Database.Connection, "test")

	collectionName := "PersonTest"
	persons := []interface{}{
		Person{"xiaoming", 10},
		Person{"xiaoli", 20},
	}

	// insert
	db.InsertMany(collectionName, persons)

	// find
	results := []Person{}
	db.FindMany(collectionName, bson.M{}, &results)
	t.Log(results)

	// single find
	var result Person
	find := db.FindOne(collectionName, bson.M{}, &result)

	if find {
		t.Log(result)
	} else {
		t.Log("not find")
	}

	// single not find
	find = db.FindOne(collectionName, bson.M{"foo": "bar"}, &result)

	if find {
		t.Log(result)
	} else {
		t.Log("not find")
	}

	// listCollectionNames
	collectionNames := db.ListCollectionNames()
	t.Log(collectionNames)

	// drop
	db.DropCollection(collectionName)
}

func TestDecode(t *testing.T) {
	config := GetConfig("../config.toml")

	db := NewMongo(config.Database.Connection, "test")

	collectionName := "PersonTest"
	persons := []interface{}{
		Person{"xiaoming", 10},
		Person{"xiaoli", 20},
	}

	// insert
	db.InsertMany(collectionName, persons)

	// single find
	var result Person

	find := db.FindOne(collectionName, bson.M{}, &result)

	if find {
		t.Log(result)
	} else {
		t.Log("not find")
	}

}

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}
