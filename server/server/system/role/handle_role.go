// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package role

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/server/helper"
	"github.com/tengge1/shadoweditor/server/server"
	"github.com/tengge1/shadoweditor/server/server/system/model"
)

func init() {
	role := Role{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Role/List", role.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Add", role.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Edit", role.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Delete", role.Delete)
}

// Role 角色控制器
type Role struct {
}

// List 获取列表
func (Role) List(w http.ResponseWriter, r *http.Request) {
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

	filter := bson.M{
		"Status": bson.M{
			"$ne": -1,
		},
	}

	if keyword != "" {
		filter1 := bson.M{
			"Name": bson.M{
				"$regex":   keyword,
				"$options": "i",
			},
		}
		filter = bson.M{
			"$and": bson.A{
				filter,
				filter1,
			},
		}
	}

	skip := int64(pageSize * (pageNum - 1))
	limit := int64(pageSize)
	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &limit,
		Sort: bson.M{
			"ID": -1,
		},
	}

	total, _ := db.Count(server.RoleCollectionName, filter)

	docs := bson.A{}
	err = db.FindMany(server.RoleCollectionName, filter, &docs, &opts)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	rows := []model.Role{}

	for _, doc := range docs {
		data := doc.(primitive.D).Map()
		rows = append(rows, model.Role{
			ID:          data["ID"].(primitive.ObjectID).Hex(),
			Name:        data["Name"].(string),
			CreateTime:  data["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:  data["UpdateTime"].(primitive.DateTime).Time(),
			Description: data["Description"].(string),
			Status:      int(data["Status"].(int32)),
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

// Add 添加
func (Role) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
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
		"Name": name,
	}

	count, _ := db.Count(server.RoleCollectionName, filter)

	if count > 0 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The name is already existed.",
		})
		return
	}

	now := time.Now()

	var doc = bson.M{
		"ID":          primitive.NewObjectID(),
		"Name":        name,
		"CreateTime":  now,
		"UpdateTime":  now,
		"Description": description,
		"Status":      0,
	}

	db.InsertOne(server.RoleCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Edit 编辑
func (Role) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
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

	// 判断是否是系统内置角色
	filter := bson.M{
		"ID": id,
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

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Modifying system built-in roles is not allowed.",
		})
		return
	}

	// 更新用户信息
	update := bson.M{
		"$set": bson.M{
			"Name":        name,
			"UpdateTime":  time.Now(),
			"Description": description,
		},
	}

	db.UpdateOne(server.RoleCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Role) Delete(w http.ResponseWriter, r *http.Request) {
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
		"ID": id,
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

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in roles.",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(server.RoleCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
