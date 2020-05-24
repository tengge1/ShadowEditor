// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// NewMongo create a mongo client using connectionString and databaseName.
func NewMongo(connectionString, databaseName string) (*Mongo, error) {
	m := Mongo{connectionString, databaseName, nil, nil}

	clientOptions := options.Client().ApplyURI(connectionString)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		return nil, err
	}

	// After 20 seconds, this function will return a timeout error.
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err = client.Connect(ctx); err != nil {
		return nil, err
	}

	db := client.Database(databaseName)

	m.Client = client
	m.Database = db

	return &m, nil
}

// Mongo represent a mongo client. You should not create Mongo directly,
// and use NewMongo instead.
type Mongo struct {
	ConnectionString string
	DatabaseName     string
	Client           *mongo.Client
	Database         *mongo.Database
}

// checkDB determine whether the database is actually created.
func (m Mongo) checkDB() error {
	if m.Client == nil || m.Database == nil {
		return fmt.Errorf("mongo client is not created, use NewMongo to create")
	}
	return nil
}

// ListCollectionNames list collectionNames of database.
func (m Mongo) ListCollectionNames() (collectionNames []string, err error) {
	if err := m.checkDB(); err != nil {
		return nil, err
	}

	nameOnly := true
	listOptions := options.ListCollectionsOptions{NameOnly: &nameOnly}

	return m.Database.ListCollectionNames(context.TODO(), bson.M{}, &listOptions)
}

// GetCollection get a collection by collectionName.
func (m Mongo) GetCollection(name string) (collection *mongo.Collection, err error) {
	if err := m.checkDB(); err != nil {
		return nil, err
	}

	return m.Database.Collection(name), nil
}

// RunCommand run a mongo command.
func (m Mongo) RunCommand(command interface{}) (result *mongo.SingleResult, err error) {
	if err := m.checkDB(); err != nil {
		return nil, err
	}

	return m.Database.RunCommand(context.TODO(), command), nil
}

// DropCollection drop a collection.
func (m Mongo) DropCollection(name string) error {
	if err := m.checkDB(); err != nil {
		return err
	}

	return m.Database.Collection(name).Drop(context.TODO())
}

// InsertOne insert one document to a collection.
func (m Mongo) InsertOne(collectionName string, document interface{}) (*mongo.InsertOneResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.InsertOne(context.TODO(), document)
}

// InsertMany insert many documents to a collection.
func (m Mongo) InsertMany(collectionName string, documents []interface{}) (*mongo.InsertManyResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.InsertMany(context.TODO(), documents)
}

// Count get documents count of a collection.
func (m Mongo) Count(collectionName string, filter interface{}) (int64, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return 0, err
	}

	return collection.CountDocuments(context.TODO(), filter)
}

// FindOne find one document from a collection.
func (m Mongo) FindOne(collectionName string, filter interface{}, result interface{}, opts ...*options.FindOneOptions) (find bool, err error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return false, err
	}

	cursor := collection.FindOne(context.TODO(), filter, opts...)
	if cursor.Err() == mongo.ErrNoDocuments {
		return false, nil
	}

	if err := cursor.Decode(result); err != nil {
		return false, err
	}

	return true, nil
}

// Find find a cursor from a collection.
func (m Mongo) Find(collectionName string, filter interface{}, opts ...*options.FindOptions) (*mongo.Cursor, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.Find(context.TODO(), filter, opts...)
}

// FindMany find many documents in the collection.
func (m Mongo) FindMany(collectionName string, filter interface{}, results interface{}, opts ...*options.FindOptions) (err error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return err
	}

	cursor, err := collection.Find(context.TODO(), filter, opts...)
	if err != nil {
		return err
	}

	defer cursor.Close(context.TODO())

	return cursor.All(context.TODO(), results)
}

// FindAll find all the documents in the collection.
func (m Mongo) FindAll(collectionName string, results interface{}, opts ...*options.FindOptions) (err error) {
	return m.FindMany(collectionName, bson.M{}, results, opts...)
}

// UpdateOne update one document.
func (m Mongo) UpdateOne(collectionName string, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.UpdateOne(context.TODO(), filter, update)
}

// UpdateMany update many documents in the collection.
func (m Mongo) UpdateMany(collectionName string, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.UpdateMany(context.TODO(), filter, update)
}

// UpdateAll update all the documents in the collection.
func (m Mongo) UpdateAll(collectionName string, update interface{}) (*mongo.UpdateResult, error) {
	return m.UpdateMany(collectionName, bson.M{}, update)
}

// DeleteOne delete one document from the collection.
func (m Mongo) DeleteOne(collectionName string, filter interface{}) (*mongo.DeleteResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.DeleteOne(context.TODO(), filter)
}

// DeleteMany delete many documents from the collection.
func (m Mongo) DeleteMany(collectionName string, filter interface{}) (*mongo.DeleteResult, error) {
	collection, err := m.GetCollection(collectionName)
	if err != nil {
		return nil, err
	}

	return collection.DeleteMany(context.TODO(), filter)
}

// DeleteAll delete all documents from the collection.
func (m Mongo) DeleteAll(collectionName string) (*mongo.DeleteResult, error) {
	return m.DeleteMany(collectionName, bson.M{})
}
