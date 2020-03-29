package helper

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/model/system"
)

// GetCurrentUser get the current login user
func GetCurrentUser() (*system.User, error) {
	return nil, nil
}

// GetUser get a user from userID
func GetUser(userID string) (*system.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	mongo, err := Mongo()
	if err != nil {
		return nil, err
	}

	collection := mongo.Collection(UserCollectionName)

	filter := bson.M{
		"ID": objectID,
	}

	result := collection.FindOne(context.TODO(), filter)
	if result == nil {
		return nil, fmt.Errorf("user (%v) is not found", userID)
	}

	user := system.User{}
	result.Decode(&user)

	// get roles and authorities
	if user.RoleID != "" {
		objectID, err := primitive.ObjectIDFromHex(user.RoleID)
		if err != nil {
			return nil, err
		}

		collection = mongo.Collection(RoleCollectionName)

		filter = bson.M{
			"ID": objectID,
		}

		result = collection.FindOne(context.TODO(), filter)

		if result != nil {
			role := system.Role{}

			result.Decode(&role)

			user.RoleID = role.ID
			user.RoleName = role.Name
			user.OperatingAuthorities = []string{}

			if role.Name == "Administrator" {
				for _, item := range GetAllOperatingAuthorities() {
					user.OperatingAuthorities = append(user.OperatingAuthorities, item.ID)
				}
			} else {
				collection := mongo.Collection(OperatingAuthorityCollectionName)

				filter := bson.M{
					"RoleID": role.ID,
				}

				cursor, err := collection.Find(context.TODO(), filter)
				if err != nil {
					return nil, err
				}

				for cursor.Next(context.TODO()) {
					authority := system.RoleAuthority{}
					cursor.Decode(&authority)

					user.OperatingAuthorities = append(user.OperatingAuthorities, authority.AuthorityID)
				}
			}
		}
	}

	return &user, nil
}
