package helper

import (
	"testing"

	"go.mongodb.org/mongo-driver/bson"

	"golang.org/x/net/context"
)

func TestMongo(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	db, err := NewMongo(config.Database.Connection, config.Database.Database)
	if err != nil {
		t.Error(err)
		return
	}

	collectionNames, err := db.ListCollectionNames()
	if err != nil {
		t.Error(err)
		return
	}

	// list collections
	for _, collectionName := range collectionNames {
		t.Logf("%v", collectionName)
	}

	// list documents
	cursor, err := db.Find("_Scene", bson.M{})
	if err != nil {
		t.Error(err)
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		record := bson.M{}
		cursor.Decode(&record)
		t.Log(cursor)
	}
}
