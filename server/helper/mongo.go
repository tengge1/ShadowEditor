// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// NewMongo create a mongo client using connectionString and databaseName.
func NewMongo(connectionString, databaseName string) *Mongo {
	m := Mongo{connectionString, databaseName, nil, nil}

	clientOptions := options.Client().ApplyURI(connectionString)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err = client.Connect(ctx); err != nil {
		panic(err)
	}

	db := client.Database(databaseName)

	m.Client = client
	m.Database = db

	return &m
}

// Mongo represent a mongo client.
type Mongo struct {
	ConnectionString string
	DatabaseName     string
	Client           *mongo.Client
	Database         *mongo.Database
}

// checkDatabase check if database really created.
func (m Mongo) checkDatabase() {
	if m.Database == nil {
		panic("mongo client is not created")
	}
}

// ListCollectionNames list collectionNames of database.
func (m Mongo) ListCollectionNames() (collectionNames []string) {
	m.checkDatabase()

	nameOnly := true
	listOptions := options.ListCollectionsOptions{NameOnly: &nameOnly}

	collectionNames, err := m.Database.ListCollectionNames(context.TODO(), bson.M{}, &listOptions)
	if err != nil {
		panic(err)
	}

	return
}

// GetCollection get a collection from collectionName.
func (m Mongo) GetCollection(name string) (collection *mongo.Collection) {
	m.checkDatabase()

	return m.Database.Collection(name)
}

// RunCommand run a mongo command.
func (m Mongo) RunCommand(command interface{}) (result *mongo.SingleResult) {
	m.checkDatabase()

	return m.Database.RunCommand(context.TODO(), command)
}

// DropCollection drop a collection.
func (m Mongo) DropCollection(name string) {
	m.checkDatabase()

	if err := m.Database.Collection(name).Drop(context.TODO()); err != nil {
		panic(err)
	}
}

// InsertOne insert one document to a collection.
func (m Mongo) InsertOne(collectionName string, document interface{}) (result *mongo.InsertOneResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.InsertOne(context.TODO(), document)
	if err != nil {
		panic(err)
	}

	return
}

// InsertMany insert many documents to a collection.
func (m Mongo) InsertMany(collectionName string, documents []interface{}) (result *mongo.InsertManyResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.InsertMany(context.TODO(), documents)
	if err != nil {
		panic(err)
	}

	return
}

// Count get documents count of a collection.
func (m Mongo) Count(collectionName string, filter interface{}) (count int64) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	count, err := collection.CountDocuments(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	return
}

// FindOne find one document from a collection.
func (m Mongo) FindOne(collectionName string, filter interface{}, result interface{}, opts ...*options.FindOneOptions) (find bool) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	cursor := collection.FindOne(context.TODO(), filter, opts...)
	if cursor.Err() == mongo.ErrNoDocuments {
		return false
	}

	if err := cursor.Decode(result); err != nil {
		panic(err)
	}

	return true
}

// Find find a cursor from a collection.
func (m Mongo) Find(collectionName string, filter interface{}, opts ...*options.FindOptions) (cursor *mongo.Cursor) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	cursor, err := collection.Find(context.TODO(), filter, opts...)
	if err != nil {
		panic(err)
	}

	return
}

// FindMany find many documents of a collection.
func (m Mongo) FindMany(collectionName string, filter interface{}, results interface{}, opts ...*options.FindOptions) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	cursor, err := collection.Find(context.TODO(), filter, opts...)
	if err != nil {
		panic(err)
	}
	defer cursor.Close(context.TODO())

	err = cursor.All(context.TODO(), results)
	if err != nil {
		panic(err)
	}
}

// FindAll find many documents of a collection.
func (m Mongo) FindAll(collectionName string, results interface{}, opts ...*options.FindOptions) {
	m.FindMany(collectionName, bson.M{}, results, opts...)
}

// UpdateOne update one document.
func (m Mongo) UpdateOne(collectionName string, filter interface{}, update interface{}) (result *mongo.UpdateResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}

	return
}

// UpdateMany update many documents.
func (m Mongo) UpdateMany(collectionName string, filter interface{}, update interface{}) (result *mongo.UpdateResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.UpdateMany(context.TODO(), filter, update)
	if err != nil {
		panic(err)
	}

	return
}

// DeleteOne delete one document.
func (m Mongo) DeleteOne(collectionName string, filter interface{}) (result *mongo.DeleteResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	return
}

// DeleteMany delete many documents.
func (m Mongo) DeleteMany(collectionName string, filter interface{}) (result *mongo.DeleteResult) {
	m.checkDatabase()

	collection := m.GetCollection(collectionName)

	result, err := collection.DeleteMany(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	return
}

// DeleteAll delete all documents.
func (m Mongo) DeleteAll(collectionName string) (result *mongo.DeleteResult) {
	return m.DeleteMany(collectionName, bson.M{})
}
