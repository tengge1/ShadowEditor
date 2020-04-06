package system

import (
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	initialize := Initialize{}
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Initialize/Initialize", initialize.Initialize)
}

// Initialize 初始化控制器
type Initialize struct {
}

// Initialize 初始化
func (Initialize) Initialize(w http.ResponseWriter, r *http.Request) {
	// 判断权限是否开启
	enableAuthority := context.Config.Authority.Enabled

	if enableAuthority != true {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Authority is not enabled.",
		})
		return
	}

	// 判断是否已经初始化
	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	doc := bson.M{}
	find, err := db.FindOne(shadow.ConfigCollectionName, bson.M{}, &doc)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if find && doc["Initialized"].(bool) == true {
		helper.WriteJSON(w, model.Result{
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
		db.InsertOne(shadow.ConfigCollectionName, doc)
	} else {
		filter11 := bson.M{
			"_id": doc["_id"].(primitive.ObjectID),
		}
		update11 := bson.M{
			"$set": bson.M{
				"Initialized": true,
			},
		}
		update12 := bson.M{
			"$set": bson.M{
				"DefaultRegisterRole": defaultRegisterRoleID,
			},
		}
		update13 := bson.A{update11, update12}
		db.UpdateOne(shadow.ConfigCollectionName, filter11, update13)
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
	db.DeleteMany(shadow.RoleCollectionName, filter)

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

	db.InsertMany(shadow.RoleCollectionName, bson.A{role1, role2})

	// 初始化用户
	password := "123456"
	salt := time.Now().String() // TODO: yyyyMMddHHmmss

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

	db.InsertOne(shadow.UserCollectionName, user)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Initialize successfully!",
	})
}
