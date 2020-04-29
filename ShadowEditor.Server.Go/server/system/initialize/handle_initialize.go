package initialize

import (
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
)

func init() {
	initialize := Initialize{}
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Initialize/Initialize", initialize.Initialize)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Initialize/Reset", initialize.Reset)
}

// Initialize 初始化控制器
type Initialize struct {
}

// Initialize 初始化
func (Initialize) Initialize(w http.ResponseWriter, r *http.Request) {
	// 判断权限是否开启
	enableAuthority := server.Config.Authority.Enabled

	if enableAuthority != true {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Authority is not enabled.",
		})
		return
	}

	// 判断是否已经初始化
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	doc := bson.M{}
	find, err := db.FindOne(server.ConfigCollectionName, bson.M{}, &doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if find && doc["Initialized"].(bool) == true {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "System has already initialized.",
		})
		return
	}

	if !find {
		doc = nil
	}

	defaultRegisterRoleID := primitive.NewObjectID()

	if doc == nil {
		doc = bson.M{
			"ID":                  primitive.NewObjectID(),
			"Initialized":         true,
			"DefaultRegisterRole": defaultRegisterRoleID,
		}
		db.InsertOne(server.ConfigCollectionName, doc)
	} else {
		filter11 := bson.M{
			"_id": doc["_id"].(primitive.ObjectID),
		}
		update11 := bson.M{
			"$set": bson.M{
				"Initialized":         true,
				"DefaultRegisterRole": defaultRegisterRoleID,
			},
		}
		db.UpdateOne(server.ConfigCollectionName, filter11, update11)
	}

	// 初始化角色
	now := time.Now()

	filter1 := bson.M{
		"Name": "Administrator",
	}
	filter2 := bson.M{
		"Name": "User",
	}
	filter3 := bson.M{
		"Name": "Guest",
	}
	filter := bson.M{
		"$or": bson.A{filter1, filter2, filter3},
	}
	db.DeleteMany(server.RoleCollectionName, filter)

	adminRoleID := primitive.NewObjectID() // 管理员RoleID

	role1 := bson.M{
		"ID":          adminRoleID,
		"Name":        "Administrator",
		"CreateTime":  now,
		"UpdateTime":  now,
		"Description": "Administrator",
		"Status":      0,
	}

	role2 := bson.M{
		"ID":          defaultRegisterRoleID,
		"Name":        "User",
		"CreateTime":  now,
		"UpdateTime":  now,
		"Description": "Login User",
		"Status":      0,
	}

	db.InsertMany(server.RoleCollectionName, bson.A{role1, role2})

	// 初始化用户
	password := "123456"
	salt := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")

	user := bson.M{
		"ID":         primitive.NewObjectID(),
		"Username":   "admin",
		"Password":   helper.MD5(password + salt),
		"Name":       "Administrator",
		"RoleID":     adminRoleID.Hex(),
		"Gender":     0,
		"Phone":      "",
		"Email":      "",
		"QQ":         "",
		"CreateTime": now,
		"UpdateTime": now,
		"Salt":       salt,
		"Status":     0,
	}

	db.InsertOne(server.UserCollectionName, user)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Initialize successfully!",
	})
}

// Reset 重置系统
func (Initialize) Reset(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	now := helper.TimeToString(time.Now(), "yyyyMMddHHmmss")

	// 备份数据表
	docs := bson.A{}
	db.FindMany(server.ConfigCollectionName, bson.M{}, &docs)
	if len(docs) > 0 {
		db.InsertMany(server.ConfigCollectionName+now, docs)
	}

	db.FindMany(server.RoleCollectionName, bson.M{}, &docs)
	if len(docs) > 0 {
		db.InsertMany(server.RoleCollectionName+now, docs)
	}

	db.FindMany(server.UserCollectionName, bson.M{}, &docs)
	if len(docs) > 0 {
		db.InsertMany(server.UserCollectionName+now, docs)
	}

	db.FindMany(server.DepartmentCollectionName, bson.M{}, &docs)
	if len(docs) > 2 {
		db.InsertMany(server.DepartmentCollectionName+now, docs)
	}

	db.FindMany(server.OperatingAuthorityCollectionName, bson.M{}, &docs)
	if len(docs) > 0 {
		db.InsertMany(server.OperatingAuthorityCollectionName+now, docs)
	}

	// 清除数据表
	db.DropCollection(server.ConfigCollectionName)
	db.DropCollection(server.RoleCollectionName)
	db.DropCollection(server.UserCollectionName)
	db.DropCollection(server.DepartmentCollectionName)
	db.DropCollection(server.OperatingAuthorityCollectionName)

	// 注销登录
	// cookie := HttpContext.Current.Request.Cookies.Get(FormsAuthentication.FormsCookieName);

	// if (cookie != null)
	// {
	// 	cookie.Expires = DateTime.Now.AddDays(-1);
	// 	HttpContext.Current.Response.Cookies.Add(cookie);
	// }

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Reset successfully!",
	})
}
