// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"go.mongodb.org/mongo-driver/mongo"
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
	dbName := "Test" + time.Now().Format("150405")
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

func TestTraction(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
	}

	// test data
	dbName := "Test" + time.Now().Format("150405")
	collectionName := "PersonTest"
	xiaoming := Person{"xiaoqiang", 30}

	// NewMongo
	db, err := NewMongo(config.Database.Connection, dbName)
	if err != nil {
		t.Error(err)
	}

	if err := db.CreateCollection(collectionName); err != nil {
		t.Error(err)
	}

	err = db.UseSession(func(sessionContext mongo.SessionContext) error {
		// StartTransaction
		if err := sessionContext.StartTransaction(); err != nil {
			t.Error(err)
			return err
		}

		if _, err := db.InsertOne(collectionName, xiaoming); err != nil {
			t.Error(err)
			return err
		}

		filter := bson.M{
			"name": "xiaoqiang",
		}

		var person Person
		find, err := db.FindOne(collectionName, filter, &person)
		if err != nil {
			t.Error(err)
			return err
		}
		if find {
			t.Errorf("expect false, get %v", find)
		}

		// CommitTransaction
		if err := sessionContext.CommitTransaction(sessionContext); err != nil {
			t.Error(err)
			return err
		}

		find, err = db.FindOne(collectionName, filter, &person)
		if err != nil {
			t.Error(err)
		}
		if !find {
			t.Errorf("expect true, get %v", find)
		}

		return nil
	})

	if err != nil {
		t.Error(err)
	}
}

func TestMongo_CollectionExists(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
	}

	dbName := "Test"

	db, err := NewMongo(config.Database.Connection, dbName)
	if err != nil {
		t.Error(err)
	}

	// collection is not existed
	collectionName := "Collection" + time.Now().Format("150405")

	existed, err := db.CollectionExists(collectionName)
	if err != nil {
		t.Error(err)
	}
	if existed == true {
		t.Errorf("expect false, get %v", existed)
	}

	// collection is existed
	if err := db.CreateCollection(collectionName); err != nil {
		t.Error(err)
	}

	existed, err = db.CollectionExists(collectionName)
	if err != nil {
		t.Error(err)
	}

	if existed == false {
		t.Errorf("expect true, get %v", existed)
	}
}

// Descriptor test struct descriptor in mongodb
type Descriptor struct {
	Foo   int `json:"foo1"`
	Bar   int `bson:"bar2"`
	Hello int `json:"bar3" bson:"foo4"`
	World int
}

func TestMongo_Descriptor(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
	}

	db, err := NewMongo(config.Database.Connection, "GISCoreTest")
	if err != nil {
		t.Error(err)
	}
	collectionName := "Descriptor"
	exists, err := db.CollectionExists(collectionName)
	if exists {
		db.DropCollection(collectionName)
	}

	descriptor := Descriptor{1, 2, 3, 4}

	if _, err := db.InsertOne(collectionName, descriptor); err != nil {
		t.Error(err)
	}

	doc := bson.M{}
	find, err := db.FindOne(collectionName, bson.M{}, &doc)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Errorf("expect true, get false")
	}
	if _, ok := doc["foo"]; !ok {
		t.Errorf("foo is not found")
	}
	if _, ok := doc["bar2"]; !ok {
		t.Errorf("bar2 is not found")
	}
	if _, ok := doc["foo4"]; !ok {
		t.Errorf("foo4 is not found")
	}
	if _, ok := doc["world"]; !ok {
		t.Errorf("world is not found")
	}
}
