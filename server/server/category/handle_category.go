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

	"github.com/tengge1/shadoweditor/server/helper"
	"github.com/tengge1/shadoweditor/server/server"
)

func init() {
	handler := Category{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Category/List", handler.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Category/Save", handler.Save)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Category/Delete", handler.Delete)
}

// Category 类别控制器
type Category struct {
}

// List 获取列表
func (Category) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	typ := strings.TrimSpace(r.FormValue("Type"))

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, err.Error())
		return
	}

	docs := []Model{}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			filter1 := bson.M{
				"UserID": user.ID,
			}

			if user.Name == "Administrator" {
				filter1 = bson.M{
					"$or": bson.A{
						filter1,
						bson.M{
							"UserID": bson.M{
								"$exists": 0,
							},
						},
					},
				}
			}

			if typ != "" {
				filter1 = bson.M{
					"$and": bson.A{
						filter1,
						bson.M{
							"Type": typ,
						},
					},
				}
			}
			db.FindMany(server.CategoryCollectionName, filter1, &docs)
		}
	} else {
		if typ != "" {
			filter1 := bson.M{
				"Type": typ,
			}
			db.FindMany(server.CategoryCollectionName, filter1, &docs)
		} else {
			db.FindAll(server.CategoryCollectionName, &docs)
		}
	}

	list := []map[string]string{}

	for _, i := range docs {
		obj := map[string]string{
			"ID":   i.ID,
			"Name": i.Name,
		}
		list = append(list, obj)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Save 保存
func (Category) Save(w http.ResponseWriter, r *http.Request) {
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
			user, err := server.GetCurrentUser(r)

			if err != nil && user != nil {
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

// Delete 删除
func (Category) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
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
		"_id": id,
	}

	db.DeleteOne(server.CategoryCollectionName, filter)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
