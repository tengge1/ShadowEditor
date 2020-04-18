package user

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
	"github.com/tengge1/shadoweditor/server/system/model"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	user := User{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/User/List", user.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Add", user.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Edit", user.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/User/Delete", user.Delete)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/User/ChangePassword", user.ChangePassword)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/User/ResetPassword", user.ResetPassword)
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

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// 获取所有角色
	roles := []model.Role{}
	db.FindAll(shadow.RoleCollectionName, &roles)

	// 获取所有机构
	depts := []model.Department{}
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

	rows := []model.User{}

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

		rows = append(rows, model.User{
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

// Add 添加
func (User) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	username := strings.TrimSpace(r.FormValue("Username"))
	password := strings.TrimSpace(r.FormValue("Password"))
	name := strings.TrimSpace(r.FormValue("Name"))
	roleID := strings.TrimSpace(r.FormValue("RoleID"))
	deptID := strings.TrimSpace(r.FormValue("DeptID"))

	if username == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Username is not allowed to be empty.",
		})
		return
	}

	if password == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Password is not allowed to be empty.",
		})
		return
	}

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	if roleID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a role.",
		})
		return
	}

	if deptID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a department.",
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
		"Username": username,
	}

	count, _ := db.Count(shadow.UserCollectionName, filter)

	if count > 0 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username is already existed.",
		})
		return
	}

	now := time.Now()

	salt := helper.TimeToString(now, "yyyyMMddHHmmss")

	doc := bson.M{
		"ID":         primitive.NewObjectID(),
		"Username":   username,
		"Password":   helper.MD5(password + salt),
		"Name":       name,
		"RoleID":     roleID,
		"DeptID":     deptID,
		"Gender":     0,
		"Phone":      "",
		"Email":      "",
		"QQ":         "",
		"CreateTime": now,
		"UpdateTime": now,
		"Salt":       salt,
		"Status":     0,
	}

	_, err = db.InsertOne(shadow.UserCollectionName, doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Edit 编辑
func (User) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	username := strings.TrimSpace(r.FormValue("Username"))
	if username == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Username is not allowed to be empty.",
		})
		return
	}

	name := strings.TrimSpace(r.FormValue("Name"))
	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	roleID := strings.TrimSpace(r.FormValue("RoleID"))
	if roleID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a role.",
		})
		return
	}

	deptID := strings.TrimSpace(r.FormValue("DeptID"))
	if deptID == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Please select a department.",
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

	// 判断是否是系统内置用户
	filter := bson.M{
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(shadow.UserCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	userName := doc["Username"].(string)

	if userName == "admin" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Modifying system built-in users is not allowed.",
		})
		return
	}

	// 判断用户名是否重复
	filter1 := bson.M{
		"ID": bson.M{
			"$ne": id,
		},
	}
	filter2 := bson.M{
		"Username": username,
	}
	filter = bson.M{
		"$and": bson.A{
			filter1,
			filter2,
		},
	}

	count, _ := db.Count(shadow.UserCollectionName, filter)
	if count > 0 {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The username is already existed.",
		})
		return
	}

	filter = bson.M{
		"ID": id,
	}

	update := bson.M{
		"$set": bson.M{
			"Username":   username,
			"Name":       name,
			"RoleID":     roleID,
			"DeptID":     deptID,
			"UpdateTime": time.Now(),
		},
	}

	db.UpdateOne(shadow.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (User) Delete(w http.ResponseWriter, r *http.Request) {
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
	find, _ := db.FindOne(shadow.UserCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	userName := doc["Username"].(string)

	if userName == "admin" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in users.",
		})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(shadow.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}

// ChangePassword 修改密码
func (User) ChangePassword(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	oldPassword := strings.TrimSpace(r.FormValue("OldPassword"))
	newPassword := strings.TrimSpace(r.FormValue("NewPassword"))
	confirmPassword := strings.TrimSpace(r.FormValue("ConfirmPassword"))

	user, err := server.GetCurrentUser(r)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if user == nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	// 验证密码是否为空
	if oldPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Old password is not allowed to be empty.",
		})
		return
	}

	if newPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password is not allowed to be empty.",
		})
		return
	}

	if confirmPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Confirm password is not allowed to be empty.",
		})
		return
	}

	if newPassword != confirmPassword {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password and confirm password is not the same.",
		})
		return
	}

	// 验证旧密码
	oldPassword = helper.MD5(oldPassword + user.Salt)

	if oldPassword != user.Password {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Old password is not correct.",
		})
		return
	}

	// 修改密码
	salt := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")
	password := helper.MD5(newPassword + salt)

	userID, _ := primitive.ObjectIDFromHex(user.ID)

	filter := bson.M{
		"ID": userID,
	}
	update := bson.M{
		"$set": bson.M{
			"Password": password,
			"Salt":     salt,
		},
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	db.UpdateOne(shadow.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Password changed successfully!",
	})
}

// ResetPassword 重置密码
func (User) ResetPassword(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	userID, err := primitive.ObjectIDFromHex(r.FormValue("UserID"))
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	newPassword := strings.TrimSpace(r.FormValue("NewPassword"))
	if newPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password is not allowed to be empty.",
		})
		return
	}

	confirmPassword := strings.TrimSpace(r.FormValue("ConfirmPassword"))
	if confirmPassword == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Confirm password is not allowed to be empty.",
		})
		return
	}

	if newPassword != confirmPassword {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "New password and confirm password is not the same.",
		})
		return
	}

	// 判断用户是否存在
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": userID,
	}
	doc := bson.M{}
	find, _ := db.FindOne(shadow.UserCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The user is not existed.",
		})
		return
	}

	// 修改密码
	salt := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")
	password := helper.MD5(newPassword + salt)

	update := bson.M{
		"$set": bson.M{
			"Password": password,
			"Salt":     salt,
		},
	}

	db.UpdateOne(shadow.UserCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Password reset successfully.",
	})
}
