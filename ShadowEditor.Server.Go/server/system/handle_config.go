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

	model := ConfigResult{
		ID:                   config.ID,
		EnableAuthority:      helper.Config.Authority.Enabled,
		Initialized:          config.Initialized,
		DefaultRegisterRole:  config.DefaultRegisterRole,
		IsLogin:              false,
		Username:             "",
		Name:                 "",
		RoleID:               "",
		RoleName:             "",
		DeptID:               "",
		DeptName:             "",
		OperatingAuthorities: []string{},
		EnableRemoteEdit:     helper.Config.Remote.Enabled,
		WebSocketServerPort:  helper.Config.Remote.WebSocketPort,
	}

	user, err := helper.GetCurrentUser(r)
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	if user != nil {
		model.IsLogin = true
		model.Username = user.Username
		model.Name = user.Name
		model.RoleID = user.RoleID
		model.RoleName = user.RoleName
		model.DeptID = user.DeptID
		model.DeptName = user.DeptName
	}

	result, err := json.Marshal(model)
	if err != nil {
		base.WriteJSON(w, base.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	w.Write(result)
}

// ConfigResult config to front end
type ConfigResult struct {
	ID                   string
	EnableAuthority      bool
	Initialized          bool
	DefaultRegisterRole  string
	IsLogin              bool
	Username             string
	Name                 string
	RoleID               string
	RoleName             string
	DeptID               string
	DeptName             string
	OperatingAuthorities []string
	EnableRemoteEdit     bool
	WebSocketServerPort  int
}
