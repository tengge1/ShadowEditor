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

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson"
)

func TestMongo(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
	}

	// test data
	dbName := "Test" + time.Now().Format(TimeFormat)
	collectionName := "PersonTest"
	person := Person{"xiaoqiang", 30}
	persons := []interface{}{
		Person{"xiaoming", 10},
		Person{"xiaoli", 20},
	}

	// NewMongo
	db, err := NewMongo(config.Database.Connection, dbName)
	if err != nil {
		t.Error(err)
	}

	// InsertOne
	if _, err := db.InsertOne(collectionName, person); err != nil {
		t.Error(err)
	}

	// InsertMany
	if _, err = db.InsertMany(collectionName, persons); err != nil {
		t.Error(err)
	}

	// FindOne
	filter := bson.M{
		"name": "xiaoqiang",
	}
	result := Person{}
	find, err := db.FindOne(collectionName, filter, &result)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Errorf("expect true, got %v", find)
	}
	if result.Name != "xiaoqiang" {
		t.Errorf("expect xiaoqiang, got %v", result.Name)
	}
	if result.Age != 30 {
		t.Errorf("expect 30, got %v", result.Age)
	}

	// FindMany
	results := []Person{}
	opts := options.FindOptions{
		Sort: bson.M{
			"age": 1,
		},
	}
	if err = db.FindMany(collectionName, bson.M{}, &results, &opts); err != nil {
		t.Error(err)
	}
	if len(results) != 3 {
		t.Errorf("expect 3, got %v", len(results))
	}
	first := results[0]
	if first.Name != "xiaoming" {
		t.Errorf("expect xiaoming, got %v", first.Name)
	}
	if first.Age != 10 {
		t.Errorf("expect 10, got %v", first.Age)
	}

	// FindOne not found
	find, err = db.FindOne(collectionName, bson.M{"foo": "bar"}, &result)
	if err != nil {
		t.Error(err)
	}
	if find {
		t.Errorf("expect false, got %v", find)
	}

	// ListCollectionNames
	collectionNames, err := db.ListCollectionNames()
	if err != nil {
		t.Error(err)
	}
	if len(collectionNames) != 1 {
		t.Errorf("expect 1, got %v", len(collectionNames))
	}

	// DropCollection
	if err = db.DropCollection(collectionName); err != nil {
		t.Error(err)
	}
}

type Person struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}
