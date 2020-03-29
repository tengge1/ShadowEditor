package helper

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/model/system"
)

func GetCurrentUser() (*system.User, error) {
	return nil, nil
}

func GetUser(userID string) (*system.User, error) {
	_, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	mongo, err := Mongo()
	if err != nil {
		return nil, err
	}

	_ = mongo.Collection(UserCollectionName)
	return nil, nil
}
