// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package mesh

import (
	"fmt"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodPost, "/api/Mesh/Download", Download, server.ListMesh)
}

// Download download a mesh.
func Download(w http.ResponseWriter, r *http.Request) {
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

	doc := bson.M{}
	find, _ := db.FindOne(server.MeshCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The asset is not existed!",
		})
		return
	}

	// create zip file
	savePath := server.MapPath(doc["SavePath"].(string))

	now := helper.TimeToString(time.Now(), "yyyyMMddHHmmssfff")
	destFile := fmt.Sprintf("/temp/%v.zip", now)
	descPhysicalFile := server.MapPath(destFile)

	helper.Zip(savePath, descPhysicalFile)

	result := Result{}
	result.Code = 200
	result.Msg = "Download successfully!"
	result.Path = destFile
	helper.WriteJSON(w, result)
}

// Result means a download mesh result.
type Result struct {
	server.Result
	Path string
}
