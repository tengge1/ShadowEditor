package helper

import (
	"testing"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"

	"golang.org/x/net/context"
)

func TestMongo(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	db, err := Mongo{config.Database.Connection, config.Database.Database}.Create()
	if err != nil {
		t.Error(err)
		return
	}

	nameOnly := true
	collectionNames, err := db.ListCollectionNames(context.TODO(), bson.M{}, &options.ListCollectionsOptions{NameOnly: &nameOnly})
	if err != nil {
		t.Error(err)
		return
	}

	// list collections
	for _, collectionName := range collectionNames {
		t.Logf("%v", collectionName)
	}

	// list documents
	collection := db.Collection("_Scene")

	cursor, err := collection.Find(context.TODO(), bson.M{})
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
