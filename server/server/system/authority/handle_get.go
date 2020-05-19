// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package authority

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	server.Handle(http.MethodGet, "/api/OperatingAuthority/Get", Get, server.Administrator)
}

// Get get authorities by the role ID.
func Get(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	roleID := r.FormValue("roleID")

	objectID, err := primitive.ObjectIDFromHex(roleID)
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

	// check whether is a built-in role
	filter := bson.M{
		"ID": objectID,
	}
	doc := bson.M{}
	find, _ := db.FindOne(server.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	// get authorities
	authorities := server.GetAllAuthorities()
	filter = bson.M{
		"RoleID": roleID,
	}

	docs := []OperatingAuthorityModel{}

	err = db.FindMany(server.OperatingAuthorityCollectionName, filter, &docs)

	rows := []map[string]interface{}{}

	for _, i := range authorities {
		// administrator has all the authorities
		enabled := false
		if roleName == "Administrator" {
			enabled = true
		} else {
			for _, doc := range docs {
				if doc.AuthorityID == i.ID {
					enabled = true
					break
				}
			}
		}

		rows = append(rows, map[string]interface{}{
			"ID":      i.ID,
			"Name":    i.Name,
			"Enabled": enabled,
		})
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: map[string]interface{}{
			"total": len(rows),
			"rows":  rows,
		},
	})
}

// OperatingAuthorityModel is _operating_authority collection structure.
type OperatingAuthorityModel struct {
	RoleID      string
	AuthorityID string
}
