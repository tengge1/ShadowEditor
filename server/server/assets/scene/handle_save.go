// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package scene

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
	server.Handle(http.MethodPost, "/api/Scene/Save", Save, server.SaveScene)
}

// Save save a scene.
func Save(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		id = primitive.NewObjectID()
	}

	name := strings.TrimSpace(r.FormValue("Name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}
	if strings.HasPrefix(name, "_") {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to start with _.",
		})
		return
	}

	data := strings.TrimSpace(r.FormValue("Data"))

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

	now := time.Now()
	var collectionName string
	version := -1

	if !find { // create scene
		collectionName = "Scene" + helper.TimeToString(now, "yyyyMMddHHmmss")
		version = 0
	} else { // edit scene
		if server.Config.Authority.Enabled {
			user, _ := server.GetCurrentUser(r)
			// save other people's scene
			if doc["UserID"] != nil && doc["UserID"].(string) != user.ID {
				helper.WriteJSON(w, server.Result{
					Code: 300,
					Msg:  "Permission denied.",
				})
				return
			}

			// not admin save scene without UserID
			if doc["UserID"] == nil && user.RoleName != "Administrator" {
				helper.WriteJSON(w, server.Result{
					Code: 300,
					Msg:  "Permission denied.",
				})
				return
			}
		}

		collectionName = doc["CollectionName"].(string)
		if doc["Version"] != nil {
			version = int(doc["Version"].(int32))
		} else {
			version = 0
		}
		version++
	}

	if !find {
		pinyin := helper.ConvertToPinYin(name)
		doc = bson.M{
			"ID":             id,
			"Name":           name,
			"TotalPinYin":    pinyin.TotalPinYin,
			"FirstPinYin":    pinyin.FirstPinYin,
			"CollectionName": collectionName,
			"Version":        version,
			"CreateTime":     now,
			"UpdateTime":     now,
			"IsPublic":       false,
		}
		if server.Config.Authority.Enabled {
			user, _ := server.GetCurrentUser(r)

			if user != nil {
				doc["UserID"] = user.ID
			}
		}

		db.InsertOne(server.SceneCollectionName, doc)
	} else {
		update := bson.M{
			"$set": bson.M{
				"Version":    version,
				"UpdateTime": now,
			},
		}
		db.UpdateOne(server.SceneCollectionName, filter, update)

		// move current scene data to history
		old := []bson.M{}
		db.FindAll(collectionName, &old)

		for _, i := range old {
			i[server.VersionField] = version - 1
		}

		if len(old) > 0 {
			// remove _id; otherwise deplicated
			for i := 0; i < len(old); i++ {
				delete(old[i], "_id")
			}

			oldData := []interface{}{}
			for _, i := range old {
				oldData = append(oldData, i)
			}

			db.InsertMany(collectionName+server.HistorySuffix, oldData)
		}
	}

	// save new scene data
	var list []interface{}
	bson.UnmarshalExtJSON([]byte(data), false, &list)

	docs := bson.A{}

	for _, i := range list {
		docs = append(docs, i)
	}

	db.DeleteAll(collectionName)
	db.InsertMany(collectionName, docs)

	result := saveResult{}
	result.Code = 200
	result.Msg = "Saved successfully!"
	result.ID = id.Hex()

	helper.WriteJSON(w, result)
}

// saveResult is the result of saving scene.
type saveResult struct {
	server.Result
	ID string
}
