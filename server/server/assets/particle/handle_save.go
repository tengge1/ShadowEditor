// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package particle

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
	server.Handle(http.MethodPost, "/api/Particle/Save", Save, server.SaveParticle)
}

// Save save a particle.
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
	find, _ := db.FindOne(server.ParticleCollectionName, filter, &doc)

	now := time.Now()

	if !find {
		pinyin := helper.ConvertToPinYin(name)
		doc = bson.M{
			"ID":           id,
			"Name":         name,
			"CategoryID":   0,
			"CategoryName": "",
			"TotalPinYin":  pinyin.TotalPinYin,
			"FirstPinYin":  pinyin.FirstPinYin,
			"Version":      0,
			"CreateTime":   now,
			"UpdateTime":   now,
			"Data":         data,
			"Thumbnail":    "",
		}
		if server.Config.Authority.Enabled {
			user, _ := server.GetCurrentUser(r)

			if user != nil {
				doc["UserID"] = user.ID
			}
		}

		db.InsertOne(server.ParticleCollectionName, doc)
	} else {
		update := bson.M{
			"UpdateTime": now,
			"Data":       data,
		}
		db.UpdateOne(server.ParticleCollectionName, filter, update)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
