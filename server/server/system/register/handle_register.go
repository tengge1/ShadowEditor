// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package register

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
	server.Handle(http.MethodPost, "/api/Register/Register", Register, server.None)
}

// Register register a user.
func Register(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.FormValue("Username"))
	password := strings.TrimSpace(r.FormValue("Password"))
	confirmPassword := strings.TrimSpace(r.FormValue("ConfirmPassword"))
	name := strings.TrimSpace(r.FormValue("name")) // TODO:

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

	if confirmPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Confirm password is not allowed to be empty.",
		})
		return
	}

	if password != confirmPassword {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Password and confirm password is not the same.",
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

	// get default register role
	defaultRegisterRole := ""

	config := bson.M{}
	find, _ := db.FindOne(server.ConfigCollectionName, bson.M{}, &config)

	if find && config["DefaultRegisterRole"] != nil {
		defaultRegisterRole = config["DefaultRegisterRole"].(primitive.ObjectID).Hex()
	} else {
		filter := bson.M{
			"Name": "User",
		}

		role := bson.M{}
		find, _ = db.FindOne(server.RoleCollectionName, filter, &role)
		if !find {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "The system has not been initialized.",
			})
			return
		}

		defaultRegisterRole = role["ID"].(primitive.ObjectID).Hex()
	}

	// add user
	now := time.Now()

	salt := helper.TimeToString(now, "yyyyMMddHHmmss")

	doc := bson.M{
		"ID":         primitive.NewObjectID(),
		"Username":   username,
		"Password":   helper.MD5(password + salt),
		"Name":       name,
		"RoleID":     defaultRegisterRole,
		"Gender":     0,
		"Phone":      "",
		"Email":      "",
		"QQ":         "",
		"CreateTime": now,
		"UpdateTime": now,
		"Salt":       salt,
		"Status":     0,
	}

	db.InsertOne(server.UserCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Register successfully!",
	})
}
