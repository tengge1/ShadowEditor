// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package typeface

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Typeface/List", List, server.Administrator)
}

// List returns the typeface list.
func List(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	opts := options.FindOptions{
		Sort: bson.M{
			"Name": 1,
		},
	}

	var docs bson.A
	db.FindAll(server.TypefaceCollectionName, &docs, &opts)

	list := []Model{}

	for _, i := range docs {
		doc := i.(primitive.D).Map()
		model := Model{
			ID:          doc["ID"].(primitive.ObjectID).Hex(),
			Name:        doc["Name"].(string),
			TotalPinYin: doc["TotalPinYin"].(string),
			FirstPinYin: doc["FirstPinYin"].(string),
			URL:         doc["Url"].(string),
			CreateTime:  doc["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:  doc["UpdateTime"].(primitive.DateTime).Time(),
		}
		list = append(list, model)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}
