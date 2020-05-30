// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"net/http"
	"testing"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"

	"go.mongodb.org/mongo-driver/bson"
)

func TestGetCurrentUser(t *testing.T) {
	if err := Create("../config.toml"); err != nil {
		t.Error(err)
	}

	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}

	// get administrator role
	filter := bson.M{
		"Name": "Administrator",
	}
	adminRole := bson.M{}
	find, err := mong.FindOne(RoleCollectionName, filter, &adminRole)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Error("Administrator role is not found")
	}
	adminRoleID := adminRole["ID"].(primitive.ObjectID).Hex()

	// get user role
	filter = bson.M{
		"Name": "User",
	}
	userRole := bson.M{}
	find, err = mong.FindOne(RoleCollectionName, filter, &userRole)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Error("User role is not found")
	}
	userRoleID := userRole["ID"].(primitive.ObjectID).Hex()

	// add test user who's role is Administrator
	now := time.Now().Format(helper.TimeFormat)
	adminUserID := primitive.NewObjectID()
	adminUser := bson.M{
		"ID":       adminUserID,
		"Username": "admin" + now,
		"RoleID":   adminRoleID,
		"Status":   0,
	}
	if _, err := mong.InsertOne(UserCollectionName, adminUser); err != nil {
		t.Error(err)
	}

	// add test user who's role is User
	userUserID := primitive.NewObjectID()
	userUser := bson.M{
		"ID":       userUserID,
		"Username": "user" + now,
		"RoleID":   userRoleID,
		"Status":   0,
	}
	if _, err := mong.InsertOne(UserCollectionName, userUser); err != nil {
		t.Error(err)
	}

	defer func() {
		// remove the users added
		filter = bson.M{
			"$or": bson.A{
				bson.M{
					"ID": adminUserID,
				},
				bson.M{
					"ID": userUserID,
				},
			},
		}
		if _, err = mong.DeleteMany(UserCollectionName, filter); err != nil {
			t.Error(err)
		}
	}()

	// current user is adminUser
	token := getToken(adminUserID.Hex(), t)

	r, err := http.NewRequest(http.MethodGet, "/", nil)
	if err != nil {
		t.Error(err)
	}
	r.AddCookie(&http.Cookie{
		Name:  "token",
		Value: token,
	})
	user, err := GetCurrentUser(r)
	if err != nil {
		t.Error(err)
	}
	if user.RoleID != adminRoleID {
		t.Errorf("expect %v, got %v", adminRoleID, user.RoleID)
	}
	if user.RoleName != "Administrator" {
		t.Errorf("expect Administrator, got %v", user.RoleName)
	}
	has := false
	for _, auth := range user.OperatingAuthorities {
		if auth == string(Administrator) {
			has = true
			break
		}
	}
	if !has {
		t.Error("expect true, got false")
	}

	// current user is userUser
	token = getToken(userUserID.Hex(), t)

	r, err = http.NewRequest(http.MethodGet, "/", nil)
	if err != nil {
		t.Error(err)
	}
	r.AddCookie(&http.Cookie{
		Name:  "token",
		Value: token,
	})
	user, err = GetCurrentUser(r)
	if err != nil {
		t.Error(err)
	}
	if user.RoleID != userRoleID {
		t.Errorf("expect %v, got %v", userRoleID, user.RoleID)
	}
	if user.RoleName != "User" {
		t.Errorf("expect User, got %v", user.RoleName)
	}
	has = false
	for _, auth := range user.OperatingAuthorities {
		if auth == string(Administrator) {
			has = true
			break
		}
	}
	if has {
		t.Error("expect false, got true")
	}
}

func TestGetUser(t *testing.T) {
	if err := Create("../config.toml"); err != nil {
		t.Error(err)
	}

	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}

	// get administrator role
	filter := bson.M{
		"Name": "Administrator",
	}
	adminRole := bson.M{}
	find, err := mong.FindOne(RoleCollectionName, filter, &adminRole)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Error("Administrator role is not found")
	}
	adminRoleID := adminRole["ID"].(primitive.ObjectID).Hex()

	// get user role
	filter = bson.M{
		"Name": "User",
	}
	userRole := bson.M{}
	find, err = mong.FindOne(RoleCollectionName, filter, &userRole)
	if err != nil {
		t.Error(err)
	}
	if !find {
		t.Error("User role is not found")
	}
	userRoleID := userRole["ID"].(primitive.ObjectID).Hex()

	// add test user who's role is Administrator
	now := time.Now().Format(helper.TimeFormat)
	adminUserID := primitive.NewObjectID()
	adminUser := bson.M{
		"ID":       adminUserID,
		"Username": "admin" + now,
		"RoleID":   adminRoleID,
		"Status":   0,
	}
	if _, err := mong.InsertOne(UserCollectionName, adminUser); err != nil {
		t.Error(err)
	}

	// add test user who's role is User
	userUserID := primitive.NewObjectID()
	userUser := bson.M{
		"ID":       userUserID,
		"Username": "user" + now,
		"RoleID":   userRoleID,
		"Status":   0,
	}
	if _, err := mong.InsertOne(UserCollectionName, userUser); err != nil {
		t.Error(err)
	}

	defer func() {
		// remove the users added
		filter = bson.M{
			"$or": bson.A{
				bson.M{
					"ID": adminUserID,
				},
				bson.M{
					"ID": userUserID,
				},
			},
		}
		if _, err = mong.DeleteMany(UserCollectionName, filter); err != nil {
			t.Error(err)
		}
	}()

	// get user who's role is Administrator
	user, err := GetUser(adminUserID.Hex())
	if err != nil {
		t.Error(err)
	}
	if user.RoleID != adminRoleID {
		t.Errorf("expect %v, got %v", adminRoleID, user.RoleID)
	}
	if user.RoleName != "Administrator" {
		t.Errorf("expect Administrator, got %v", user.RoleName)
	}
	has := false
	for _, auth := range user.OperatingAuthorities {
		if auth == string(Administrator) {
			has = true
			break
		}
	}
	if !has {
		t.Error("expect true, got false")
	}

	// get user who's role is User
	user, err = GetUser(userUserID.Hex())
	if err != nil {
		t.Error(err)
	}
	if user.RoleID != userRoleID {
		t.Errorf("expect %v, got %v", userRoleID, user.RoleID)
	}
	if user.RoleName != "User" {
		t.Errorf("expect User, got %v", user.RoleName)
	}
	has = false
	for _, auth := range user.OperatingAuthorities {
		if auth == string(Administrator) {
			has = true
			break
		}
	}
	if has {
		t.Error("expect false, got true")
	}
}
