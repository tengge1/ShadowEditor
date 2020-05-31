// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package category

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Category/Save", Save, server.SaveCategory)
}

// Save save a category
func Save(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	// TODO： Uppercase `ID` and lowercase `id` are not unified.
	id := strings.TrimSpace(r.FormValue("id"))

	name := strings.TrimSpace(r.FormValue("name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	typ := strings.TrimSpace(r.FormValue("type"))
	if typ == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Type is not allowed to be empty!",
		})
		return
	}

	// update mongo
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if id == "" {
		doc := bson.M{
			"Name": name,
			"Type": typ,
		}
		if server.Config.Authority.Enabled {
			user, _ := server.GetCurrentUser(r)

			if user != nil {
				doc["UserID"] = user.ID
			}
		}
		db.InsertOne(server.CategoryCollectionName, doc)
	} else {
		objID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			helper.WriteJSON(w, server.Result{
				Code: 300,
				Msg:  err.Error(),
			})
			return
		}

		filter := bson.M{
			"_id": objID,
		}
		update := bson.M{
			"$set": bson.M{
				"Name": name,
				"Type": typ,
			},
		}
		db.UpdateOne(server.CategoryCollectionName, filter, update)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
