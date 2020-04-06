package system

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"github.com/tengge1/shadoweditor/model/system"
)

func init() {
	config := Config{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Config/Get", config.Get)
}

// Config 配置控制器
type Config struct {
}

// Get 获取配置信息
func (Config) Get(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	config := system.Config{}
	find, err := db.FindOne(shadow.ConfigCollectionName, bson.M{}, &config)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if !find {
		doc1 := bson.M{
			"ID":                  primitive.NewObjectID().Hex(),
			"Initialized":         false,
			"DefaultRegisterRole": "",
		}
		db.InsertOne(shadow.ConfigCollectionName, doc1)
		db.FindOne(shadow.ConfigCollectionName, bson.M{}, &config)
	}

	result := ConfigResult{
		ID:                   config.ID,
		EnableAuthority:      context.Config.Authority.Enabled,
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
		EnableRemoteEdit:     context.Config.Remote.Enabled,
		WebSocketServerPort:  context.Config.Remote.WebSocketPort,
	}

	user, err := context.GetCurrentUser(r)
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	if user != nil {
		result.IsLogin = true
		result.Username = user.Username
		result.Name = user.Name
		result.RoleID = user.RoleID
		result.RoleName = user.RoleName
		result.DeptID = user.DeptID
		result.DeptName = user.DeptName
	}

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: result,
	})
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
