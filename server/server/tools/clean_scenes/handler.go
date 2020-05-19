// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package cleanscenes

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/CleanUpScenes/Run", Handle, server.Administrator)
}

// Handle clean up history scenes and deleted scenes in the mongo.
func Handle(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	var scenes []bson.M

	db.FindAll(server.SceneCollectionName, &scenes)

	collectionNames, err := db.ListCollectionNames()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	for _, collectionName := range collectionNames {
		if !strings.HasPrefix(collectionName, "Scene") {
			continue
		}
		if strings.HasSuffix(collectionName, "_history") {
			db.DropCollection(collectionName)
			continue
		}

		contains := false
		for _, scene := range scenes {
			if scene["CollectionName"].(string) == collectionName {
				contains = true
				break
			}
		}

		if !contains {
			db.DropCollection(collectionName)
		}
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Execute sucessfully!",
	})
}
