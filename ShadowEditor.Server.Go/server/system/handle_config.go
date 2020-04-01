package system

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model/system"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	config := Config{}
	base.Register("/api/Config/Get", config.Get)
}

// Config 配置控制器
type Config struct {
}

// Get 获取配置信息
func (Config) Get(w http.ResponseWriter, r *http.Request) {
	db, err := helper.NewMongo()
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	doc, err := db.FindOne(shadow.ConfigCollectionName, bson.M{})

	if err != nil || doc == nil {
		doc1 := bson.M{
			"ID":                  primitive.NewObjectID().Hex(),
			"Initialized":         false,
			"DefaultRegisterRole": "",
		}
		db.InsertOne(shadow.ConfigCollectionName, doc1)
		doc, _ = db.FindOne(shadow.ConfigCollectionName, bson.M{})
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

	base.WriteJSON(w, base.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: model,
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
