// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package user

import (
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/User/Edit", Edit, server.Administrator)
}

// Edit change a user's name, department and role.
func Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	username := strings.TrimSpace(r.FormValue("Username"))
	if username == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Username is not allowed to be empty.",
		})
		return
	}

	name := strings.TrimSpace(r.FormValue("Name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	roleID := strings.TrimSpace(r.FormValue("RoleID"))
	if roleID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a role.",
		})
		return
	}

	deptID := strings.TrimSpace(r.FormValue("DeptID"))
	if deptID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a department.",
		})
		return
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// check whether is built-in user
	filter := bson.M{
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(server.UserCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	userName := doc["Username"].(string)

	if userName == "admin" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Modifying system built-in users is not allowed.",
		})
		return
	}

	// check whether username is duplicated
	filter1 := bson.M{
		"ID": bson.M{
			"$ne": id,
		},
	}
	filter2 := bson.M{
		"Username": username,
	}
	filter = bson.M{
		"$and": bson.A{
			filter1,
			filter2,
		},
	}

	count, _ := db.Count(server.UserCollectionName, filter)
	if count > 0 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username is already existed.",
		})
		return
	}

	filter = bson.M{
		"ID": id,
	}

	update := bson.M{
		"$set": bson.M{
			"Username":   username,
			"Name":       name,
			"RoleID":     roleID,
			"DeptID":     deptID,
			"UpdateTime": time.Now(),
		},
	}

	db.UpdateOne(server.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
