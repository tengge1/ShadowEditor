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
	user := User{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/User/List", user.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Add", user.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Edit", user.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Delete", user.Delete)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/User/ChangePassword", user.ChangePassword)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/User/ResetPassword", user.ResetPassword)
}

// User 用户控制器
type User struct {
}

// List 获取列表
func (User) List(w http.ResponseWriter, r *http.Request) {
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

	// 获取所有角色
	roles := []system.Role{}
	db.FindAll(shadow.RoleCollectionName, &roles)

	// 获取所有机构
	depts := []system.Department{}
	db.FindAll(shadow.DepartmentCollectionName, &depts)

	// 获取用户
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

	total, _ := db.Count(shadow.UserCollectionName, filter)

	docs := bson.A{}
	db.FindMany(shadow.UserCollectionName, filter, &docs, &opts)

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
func (User) Add(w http.ResponseWriter, r *http.Request) {
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
func (User) Edit(w http.ResponseWriter, r *http.Request) {
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
func (User) Delete(w http.ResponseWriter, r *http.Request) {
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

// ChangePassword 修改密码
func (User) ChangePassword(w http.ResponseWriter, r *http.Request) {

}

// ResetPassword 重置密码
func (User) ResetPassword(w http.ResponseWriter, r *http.Request) {

}
