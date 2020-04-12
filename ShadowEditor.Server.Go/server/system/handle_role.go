package system

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"github.com/tengge1/shadoweditor/model/system"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	role := Role{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Role/List", role.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Add", role.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Edit", role.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Delete", role.Delete)
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

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
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
			"$regex": bson.M{
				"Name": "/" + keyword + "/i",
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

	total, _ := db.Count(shadow.RoleCollectionName, filter)

	docs := bson.A{}
	err = db.FindMany(shadow.RoleCollectionName, filter, &docs, &opts)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	rows := []system.Role{}

	for _, doc := range docs {
		data := doc.(primitive.D).Map()
		rows = append(rows, system.Role{
			ID:          data["ID"].(primitive.ObjectID).Hex(),
			Name:        data["Name"].(string),
			CreateTime:  data["CreateTime"].(primitive.DateTime).Time(),
			UpdateTime:  data["UpdateTime"].(primitive.DateTime).Time(),
			Description: data["Description"].(string),
			Status:      int(data["Status"].(int32)),
		})
	}

	helper.WriteJSON(w, model.Result{
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
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"Name": name,
	}

	count, _ := db.Count(shadow.RoleCollectionName, filter)

	if count > 0 {
		helper.WriteJSON(w, model.Result{
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

	db.InsertOne(shadow.RoleCollectionName, doc)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Edit 编辑
func (Role) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

	if name == "" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
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
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Modifying system built-in roles is not allowed.",
		})
		return
	}

	// 更新用户信息
	update1 := bson.M{
		"$set": bson.M{
			"Name": name,
		},
	}
	update2 := bson.M{
		"$set": bson.M{
			"UpdateTime": time.Now(),
		},
	}
	update3 := bson.M{
		"$set": bson.M{
			"Description": description,
		},
	}

	update := bson.A{update1, update2, update3}

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Role) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": id,
	}

	doc := bson.M{}
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in roles.",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
