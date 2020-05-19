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
	server.Handle(http.MethodPost, "/api/User/Add", Add, server.Administrator)
}

// Add add a user.
func Add(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.FormValue("Username"))
	password := strings.TrimSpace(r.FormValue("Password"))
	name := strings.TrimSpace(r.FormValue("Name"))
	roleID := strings.TrimSpace(r.FormValue("RoleID"))
	deptID := strings.TrimSpace(r.FormValue("DeptID"))

	if username == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Username is not allowed to be empty.",
		})
		return
	}

	if password == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Password is not allowed to be empty.",
		})
		return
	}

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	if roleID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a role.",
		})
		return
	}

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

	filter := bson.M{
		"Username": username,
	}

	count, _ := db.Count(server.UserCollectionName, filter)

	if count > 0 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username is already existed.",
		})
		return
	}

	now := time.Now()

	salt := helper.TimeToString(now, "yyyyMMddHHmmss")

	doc := bson.M{
		"ID":         primitive.NewObjectID(),
		"Username":   username,
		"Password":   helper.MD5(password + salt),
		"Name":       name,
		"RoleID":     roleID,
		"DeptID":     deptID,
		"Gender":     0,
		"Phone":      "",
		"Email":      "",
		"QQ":         "",
		"CreateTime": now,
		"UpdateTime": now,
		"Salt":       salt,
		"Status":     0,
	}

	_, err = db.InsertOne(server.UserCollectionName, doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
