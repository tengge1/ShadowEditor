// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package initialize

import (
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Initialize/Initialize", Initialize, server.Initialize)
}

// Initialize initialize the authority system.
func Initialize(w http.ResponseWriter, r *http.Request) {
	// check whether the authority is enabled.
	enableAuthority := server.Config.Authority.Enabled

	if enableAuthority != true {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Authority is not enabled.",
		})
		return
	}

	// check whether is initialized
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	doc := bson.M{}
	find, err := db.FindOne(server.ConfigCollectionName, bson.M{}, &doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if find && doc["Initialized"].(bool) == true {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "System has already initialized.",
		})
		return
	}

	if !find {
		doc = nil
	}

	defaultRegisterRoleID := primitive.NewObjectID()

	if doc == nil {
		doc = bson.M{
			"ID":                  primitive.NewObjectID(),
			"Initialized":         true,
			"DefaultRegisterRole": defaultRegisterRoleID,
		}
		db.InsertOne(server.ConfigCollectionName, doc)
	} else {
		filter11 := bson.M{
			"_id": doc["_id"].(primitive.ObjectID),
		}
		update11 := bson.M{
			"$set": bson.M{
				"Initialized":         true,
				"DefaultRegisterRole": defaultRegisterRoleID,
			},
		}
		db.UpdateOne(server.ConfigCollectionName, filter11, update11)
	}

	// init roles
	now := time.Now()

	filter1 := bson.M{
		"Name": "Administrator",
	}
	filter2 := bson.M{
		"Name": "User",
	}
	filter3 := bson.M{
		"Name": "Guest",
	}
	filter := bson.M{
		"$or": bson.A{filter1, filter2, filter3},
	}
	db.DeleteMany(server.RoleCollectionName, filter)

	adminRoleID := primitive.NewObjectID() // Administrator Role ID

	role1 := bson.M{
		"ID":          adminRoleID,
		"Name":        "Administrator",
		"CreateTime":  now,
		"UpdateTime":  now,
		"Description": "Administrator",
		"Status":      0,
	}

	role2 := bson.M{
		"ID":          defaultRegisterRoleID,
		"Name":        "User",
		"CreateTime":  now,
		"UpdateTime":  now,
		"Description": "Login User",
		"Status":      0,
	}

	db.InsertMany(server.RoleCollectionName, bson.A{role1, role2})

	// init users
	password := "123456"
	salt := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")

	user := bson.M{
		"ID":         primitive.NewObjectID(),
		"Username":   "admin",
		"Password":   helper.MD5(password + salt),
		"Name":       "Administrator",
		"RoleID":     adminRoleID.Hex(),
		"Gender":     0,
		"Phone":      "",
		"Email":      "",
		"QQ":         "",
		"CreateTime": now,
		"UpdateTime": now,
		"Salt":       salt,
		"Status":     0,
	}

	db.InsertOne(server.UserCollectionName, user)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Initialize successfully!",
	})
}
