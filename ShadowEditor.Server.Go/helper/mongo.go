package helper

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Mongo create new mongo from current config
func Mongo() (db *mongo.Database, err error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	return NewMongo(Config.Database.Connection, Config.Database.Database)
}

// NewMongo create mongo database from collection string and databasename
func NewMongo(connection, database string) (db *mongo.Database, err error) {
	clientOptions := options.Client().ApplyURI(connection)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	db = client.Database(database)
	return
}
