// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package config

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Config/Save", Save, server.Administrator)
}

// Save save system config.
func Save(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	defaultRegisterRole, err := primitive.ObjectIDFromHex(r.FormValue("DefaultRegisterRole"))

	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
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

	var doc bson.M
	find, _ := db.FindOne(server.ConfigCollectionName, bson.M{}, &doc)

	if !find {
		doc = bson.M{
			"ID":                  primitive.NewObjectID(),
			"Initialized":         false,
			"DefaultRegisterRole": defaultRegisterRole,
		}
		db.InsertOne(server.ConfigCollectionName, doc)
	} else {
		update := bson.M{
			"$set": bson.M{
				"DefaultRegisterRole": defaultRegisterRole,
			},
		}
		db.UpdateOne(server.ConfigCollectionName, bson.M{}, update)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Save Successfully.",
		Data: bson.M{
			"DefaultRegisterRole": defaultRegisterRole,
		},
	})
}
