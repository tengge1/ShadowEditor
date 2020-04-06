package context

import (
	"context"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/model/system"
)

// GetCurrentUser get the current login user
func GetCurrentUser(r *http.Request) (*system.User, error) {
	cookies := r.Cookies()

	if len(cookies) == 0 {
		return nil, nil
	}

	var cookie *http.Cookie = nil

	for _, item := range cookies {
		if item.Name == ".ASPXAUTH" {
			cookie = item
			break
		}
	}

	if cookie == nil {
		return nil, nil
	}

	user, err := GetUser(cookie.Value)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetUser get a user from userID.
func GetUser(userID string) (*system.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	mongo, err := Mongo()
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"ID": objectID,
	}

	user := system.User{}

	find, err := mongo.FindOne(shadow.UserCollectionName, filter, &user)
	if err != nil {
		return nil, err
	}
	if !find {
		return nil, fmt.Errorf("user (%v) is not found", userID)
	}

	// get roles and authorities
	if user.RoleID != "" {
		objectID, err := primitive.ObjectIDFromHex(user.RoleID)
		if err != nil {
			return nil, err
		}

		filter = bson.M{
			"ID": objectID,
		}

		role := system.Role{}
		find, err = mongo.FindOne(shadow.RoleCollectionName, filter, &role)
		if err != nil {
			return nil, err
		}

		if find {
			user.RoleID = role.ID
			user.RoleName = role.Name
			user.OperatingAuthorities = []string{}

			if role.Name == "Administrator" {
				for _, item := range shadow.GetAllOperatingAuthorities() {
					user.OperatingAuthorities = append(user.OperatingAuthorities, item.ID)
				}
			} else {
				filter := bson.M{
					"RoleID": role.ID,
				}

				cursor, err := mongo.Find(shadow.OperatingAuthorityCollectionName, filter)
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
