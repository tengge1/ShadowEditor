// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package user

import (
	"net/http"
	"strconv"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
	"github.com/tengge1/shadoweditor/server/system"
)

func init() {
	server.Handle(http.MethodGet, "/api/User/List", List, server.Administrator)
}

// List returns the user list.
func List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	pageSize, err := strconv.Atoi(r.FormValue("pageSize"))
	if err != nil {
		pageSize = 20
	}
	pageNum, err := strconv.Atoi(r.FormValue("pageNum"))
	if err != nil {
		pageNum = 1
	}
	keyword := strings.TrimSpace(r.FormValue("keyword"))

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// get all roles
	roles := []system.Role{}
	db.FindAll(server.RoleCollectionName, &roles)

	// get all departments
	depts := []system.Department{}
	db.FindAll(server.DepartmentCollectionName, &depts)

	// get users
	filter := bson.M{
		"Status": bson.M{
			"$ne": -1,
		},
	}

	if keyword != "" {
		filter1 := bson.M{
			"Username": bson.M{
				"$regex":   keyword,
				"$options": "i",
			},
		}
		filter2 := bson.M{
			"Name": bson.M{
				"$regex":   keyword,
				"$options": "i",
			},
		}
		filter3 := bson.M{
			"$or": bson.A{
				filter1,
				filter2,
			},
		}
		filter = bson.M{
			"$and": bson.A{
				filter,
				filter3,
			},
		}
	}

	skip := int64(pageSize * (pageNum - 1))
	limit := int64(pageSize)
	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &limit,
		Sort: bson.M{
			"_id": -1,
		},
	}

	total, _ := db.Count(server.UserCollectionName, filter)

	docs := bson.A{}
	db.FindMany(server.UserCollectionName, filter, &docs, &opts)

	rows := []system.User{}

	for _, doc := range docs {
		data := doc.(primitive.D).Map()
		roleID := data["RoleID"].(string)

		roleName := ""
		for _, role := range roles {
			if role.ID == roleID {
				roleName = role.Name
				break
			}
		}

		deptID := ""
		if data["DeptID"] != nil {
			deptID = data["DeptID"].(string)
		}

		deptName := ""
		if deptID != "" {
			for _, dept := range depts {
				if dept.ID == deptID {
					deptName = dept.Name
					break
				}
			}
		}

		rows = append(rows, system.User{
			ID:         data["ID"].(primitive.ObjectID).Hex(),
			Username:   data["Username"].(string),
			Password:   "",
			Name:       data["Name"].(string),
			RoleID:     roleID,
			RoleName:   roleName,
			DeptID:     deptID,
			DeptName:   deptName,
			Gender:     int(data["Gender"].(int32)),
			Phone:      data["Phone"].(string),
			Email:      data["Email"].(string),
			QQ:         data["QQ"].(string),
			CreateTime: data["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime: data["UpdateTime"].(primitive.DateTime).Time(),
			Status:     int(data["Status"].(int32)),
		})
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: map[string]interface{}{
			"total": total,
			"rows":  rows,
		},
	})
}
