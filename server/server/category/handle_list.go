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

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/Category/List", List, server.None)
}

// List returns category list.
func List(w http.ResponseWriter, r *http.Request) {
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
