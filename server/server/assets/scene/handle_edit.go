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

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Scene/Edit", Edit, server.EditScene)
}

// Edit change name, category and thumbnail of a scene.
func Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(strings.TrimSpace(r.FormValue("ID")))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
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

	thumbnail := strings.TrimSpace(r.FormValue("Image"))
	category := strings.TrimSpace(r.FormValue("Category"))
	isPublic := strings.TrimSpace(r.FormValue("IsPublic"))

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		filter11 := bson.M{
			"ID": id,
		}
		doc := bson.M{}
		find, _ := db.FindOne(server.SceneCollectionName, filter11, &doc)

		if !find {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  "The scene is not existed.",
			})
			return
		}

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

	pinyin := helper.ConvertToPinYin(name)

	filter := bson.M{
		"ID": id,
	}
	set := bson.M{
		"Name":        name,
		"TotalPinYin": pinyin.TotalPinYin,
		"FirstPinYin": pinyin.FirstPinYin,
		"Thumbnail":   thumbnail,
		"IsPublic":    isPublic == "true",
	}
	update := bson.M{
		"$set": set,
	}
	if category == "" {
		update["$unset"] = bson.M{
			"Category": 1,
		}
	} else {
		set["Category"] = category
	}

	db.UpdateOne(server.SceneCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
