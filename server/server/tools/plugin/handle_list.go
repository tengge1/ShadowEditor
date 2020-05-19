// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package plugin

import (
	"net/http"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Plugin/List", List, server.Administrator)
}

// List returns the plugin list.
func List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	pageSize, err := strconv.Atoi(r.FormValue("pageSize"))
	if err != nil {
		pageSize = 20
	}
	pageNum, err := strconv.Atoi(r.FormValue("pageNum"))
	if err != nil {
		pageNum = 1
	}
	keyword := strings.TrimSpace(r.FormValue("keyword"))

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"Status": bson.M{
			"$ne": -1,
		},
	}

	if keyword != "" {
		filter1 := bson.M{
			"Name": bson.M{
				"$regex": keyword,
			},
		}
		filter = bson.M{
			"$and": bson.A{
				filter,
				filter1,
			},
		}
	}

	skip := int64(pageSize * (pageNum - 1))
	limit := int64(pageNum)
	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &limit,
		Sort: bson.M{
			"ID": -1,
		},
	}

	total, _ := db.Count(server.PluginCollectionName, filter)
	var docs bson.A
	db.FindAll(server.PluginCollectionName, &docs, &opts)

	rows := []Model{}

	for _, i := range docs {
		doc := i.(primitive.D).Map()
		info := Model{
			ID:          doc["ID"].(primitive.ObjectID).Hex(),
			Name:        doc["Name"].(string),
			Source:      doc["Source"].(string),
			CreateTime:  doc["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:  doc["UpdateTime"].(primitive.DateTime).Time(),
			Description: doc["Description"].(string),
			Status:      int(doc["Status"].(int32)),
		}
		rows = append(rows, info)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: map[string]interface{}{
			"total": total,
			"rows":  rows,
		},
	})
}
