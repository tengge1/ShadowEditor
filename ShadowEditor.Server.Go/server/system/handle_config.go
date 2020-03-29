package system

import (
	"context"
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model/system"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	config := Config{}
	base.Register("/api/Config/List", config.Get)
}

// Config 配置控制器
type Config struct {
}

// Get 获取配置信息
func (Config) Get(w http.ResponseWriter, r *http.Request) {
	db, err := helper.Mongo()
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	collection := db.Collection(helper.ConfigCollectionName)

	doc := collection.FindOne(context.TODO(), bson.M{})

	if doc == nil {
		doc1 := bson.M{
			"ID":                  primitive.NewObjectID().Hex(),
			"Initialized":         false,
			"DefaultRegisterRole": "",
		}
		collection.InsertOne(context.TODO(), doc1)
		doc = collection.FindOne(context.TODO(), bson.M{})
	}

	config := system.Config{}
	doc.Decode(&config)

	model := map[string]interface{}{
		"ID":                   config.ID,
		"EnableAuthority":      helper.Config.Authority.Enabled,
		"Initialized":          config.Initialized,
		"DefaultRegisterRole":  config.DefaultRegisterRole,
		"IsLogin":              false,
		"Username":             "",
		"Name":                 "",
		"RoleID":               0,
		"RoleName":             "",
		"DeptID":               0,
		"DeptName":             "",
		"OperatingAuthorities": []string{},
		"EnableRemoteEdit":     helper.Config.Remote.Enabled,
		"WebSocketServerPort":  helper.Config.Remote.WebSocketPort,
	}

	result, err := json.Marshal(model)
	if err != nil {
		base.WriteJSON(w, map[string]interface{}{
			"Code": 300,
			"Msg":  err.Error(),
		})
		return
	}

	w.Write(result)
}
