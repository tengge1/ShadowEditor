package helper

import (
	"testing"

	"github.com/tengge1/shadoweditor/server"
	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func TestSort(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	db, err := NewMongo(config.Database.Connection, "ShadowEditor")
	if err != nil {
		t.Error(err)
		return
	}

	opts := options.FindOptions{
		Sort: bson.M{
			"Name": -1,
		},
	}

	results := bson.A{}

	err = db.FindMany(server.UserCollectionName, bson.M{}, &results, &opts)
	if err != nil {
		t.Error(err)
		return
	}

	for _, res := range results {
		data, ok := res.(primitive.D)
		if ok {
			m := data.Map()
			t.Log(m["Name"].(string))
		}
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
