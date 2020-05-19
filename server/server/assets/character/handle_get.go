// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package character

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Character/Get", Get, server.ListCharacter)
}

// Get get a character by ID.
func Get(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
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
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(server.CharacterCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The character is not existed.",
		})
		return
	}

	thumbnail, _ := doc["Thumbnail"].(string)
	obj := Model{
		ID:          doc["_id"].(primitive.ObjectID).Hex(),
		Name:        doc["Name"].(string),
		TotalPinYin: helper.PinYinToString(doc["TotalPinYin"]),
		FirstPinYin: helper.PinYinToString(doc["FirstPinYin"]),
		CreateTime:  doc["CreateTime"].(primitive.DateTime).Time(),
		UpdateTime:  doc["UpdateTime"].(primitive.DateTime).Time(),
		Data:        doc["Data"].(string),
		Thumbnail:   thumbnail,
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: obj,
	})
}
