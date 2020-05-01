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
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	db, err := NewMongo(config.Database.Connection, "test")
	if err != nil {
		t.Error(err)
		return
	}
	collectionName := "PersonTest"
	persons := []interface{}{
		Person{"xiaoming", 10},
		Person{"xiaoli", 20},
	}

	// insert
	_, err = db.InsertMany(collectionName, persons)
	if err != nil {
		t.Error(err)
		return
	}

	// find
	results := []Person{}
	err = db.FindMany(collectionName, bson.M{}, &results)
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(results)

	// single find
	var result Person
	find, err := db.FindOne(collectionName, bson.M{}, &result)
	if err != nil {
		t.Error(err)
		return
	}
	if find {
		t.Log(result)
	} else {
		t.Log("not find")
	}

	// single not find
	find, err = db.FindOne(collectionName, bson.M{"foo": "bar"}, &result)
	if err != nil {
		t.Error(err)
		return
	}
	if find {
		t.Log(result)
	} else {
		t.Log("not find")
	}

	// listCollectionNames
	collectionNames, err := db.ListCollectionNames()
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(collectionNames)

	// drop
	err = db.DropCollection(collectionName)
	if err != nil {
		t.Error(err)
	}
}

func TestDecode(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	db, err := NewMongo(config.Database.Connection, "test")
	if err != nil {
		t.Error(err)
		return
	}
	collectionName := "PersonTest"
	persons := []interface{}{
		Person{"xiaoming", 10},
		Person{"xiaoli", 20},
	}

	// insert
	_, err = db.InsertMany(collectionName, persons)
	if err != nil {
		t.Error(err)
		return
	}

	// single find
	var result Person
	find, err := db.FindOne(collectionName, bson.M{}, &result)
	if err != nil {
		t.Error(err)
		return
	}
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
