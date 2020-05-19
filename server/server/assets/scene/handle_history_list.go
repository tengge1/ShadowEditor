// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package scene

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Scene/HistoryList", HistoryList, server.None)
}

// HistoryList returns scene history list.
func HistoryList(w http.ResponseWriter, r *http.Request) {
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
	find, _ := db.FindOne(server.SceneCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The scene is not existed!",
		})
		return
	}

	list := []HistoryModel{}

	sceneID := doc["ID"].(primitive.ObjectID).Hex()
	name := doc["CollectionName"].(string)
	version := doc["Version"].(int32)
	createTime := doc["CreateTime"].(primitive.DateTime).Time()

	list = append(list, HistoryModel{
		ID:         doc["_id"].(primitive.ObjectID).Hex(),
		SceneID:    sceneID,
		SceneName:  name,
		Version:    int(version),
		IsNew:      true,
		CreateTime: createTime,
		UpdateTime: doc["UpdateTime"].(primitive.DateTime).Time(),
	})

	// history versions
	historyName := fmt.Sprintf("%v%v", name, server.HistorySuffix)
	historyCollection, _ := db.GetCollection(historyName)

	if historyCollection != nil {
		filter1 := bson.M{
			"metadata.generator": "OptionsSerializer",
		}
		opts1 := options.FindOptions{
			Sort: bson.M{
				"_version": -1,
			},
		}
		docs1 := bson.A{}
		db.FindMany(historyName, filter1, &docs1, &opts1)

		for _, i := range docs1 {
			n := i.(primitive.D).Map()
			historyID := n["_id"].(primitive.ObjectID)

			list = append(list, HistoryModel{
				ID:         historyID.Hex(),
				SceneID:    sceneID,
				SceneName:  name,
				Version:    int(n["_version"].(int32)),
				IsNew:      false,
				CreateTime: createTime,
				UpdateTime: historyID.Timestamp(),
			})
		}
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// HistoryModel is scene history model.
type HistoryModel struct {
	// Scene History ID
	ID string
	// Scene ID
	SceneID string
	// Scene Name
	SceneName string
	// Version
	Version int
	// Is Latest Version
	IsNew bool
	// Create Time
	CreateTime time.Time
	// Update Time
	UpdateTime time.Time
}
