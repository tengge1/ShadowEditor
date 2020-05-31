// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/server/system"
)

// GetCurrentUser get the current login user. It returns nil if there is something wrong.
func GetCurrentUser(r *http.Request) (*system.User, error) {
	var cookie *http.Cookie = nil
	for _, item := range r.Cookies() {
		if item.Name == "token" {
			cookie = item
			break
		}
	}

	// get current user
	var user *system.User = nil
	if cookie != nil {
		token, err := jwt.Parse(cookie.Value, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(Config.Authority.SecretKey), nil
		})
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token != nil && token.Valid {
			user, _ = GetUser(claims["userID"].(string))
		} else {
			Logger.Error(err.Error())
		}
	}

	// user has LOGIN auth when login
	if user != nil && user.OperatingAuthorities != nil {
		user.OperatingAuthorities = append(user.OperatingAuthorities, string(Login))
	}

	return user, nil
}

// GetUser get a user from userID.
func GetUser(userID string) (*system.User, error) {
	// parse ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// create mongo client
	mongo, err := Mongo()
	if err != nil {
		return nil, err
	}

	// get user from mongo
	filter := bson.M{
		"ID": userObjectID,
	}
	user := system.User{}
	find, err := mongo.FindOne(UserCollectionName, filter, &user)
	if err != nil {
		return nil, err
	}
	if !find { // user is not found
		return nil, nil
	}

	// user's RoleID is empty
	if user.RoleID == "" {
		return &user, nil
	}

	// get roles and authorities
	roleObjectID, err := primitive.ObjectIDFromHex(user.RoleID)
	if err != nil {
		return nil, err
	}

	filter = bson.M{
		"ID": roleObjectID,
	}

	role := system.Role{}
	find, err = mongo.FindOne(RoleCollectionName, filter, &role)
	if err != nil {
		return nil, err
	}

	// role is not found
	if !find {
		return &user, nil
	}

	// find role
	user.RoleID = role.ID
	user.RoleName = role.Name
	user.OperatingAuthorities = []string{}

	if role.Name == "Administrator" {
		// Administrator has all the authorities except Initialize
		for _, item := range GetAllAuthorities() {
			user.OperatingAuthorities = append(user.OperatingAuthorities, item.ID)
		}
	} else {
		// other roles get authorities from operating authority collection
		filter := bson.M{
			"RoleID": role.ID,
		}

		cursor, err := mongo.Find(OperatingAuthorityCollectionName, filter)
		if err != nil {
			return nil, err
		}

		for cursor.Next(context.TODO()) {
			authority := system.RoleAuthority{}
			cursor.Decode(&authority)

			user.OperatingAuthorities = append(user.OperatingAuthorities, authority.AuthorityID)
		}
	}

	return &user, nil
}
