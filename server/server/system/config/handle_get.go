// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package config

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
	"github.com/tengge1/shadoweditor/server/system"
)

func init() {
	server.Handle(http.MethodGet, "/api/Config/Get", Get, server.None)
}

// Get get the server config of the current user.
func Get(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	config := system.Config{}
	find, err := db.FindOne(server.ConfigCollectionName, bson.M{}, &config)
	if err != nil {
		helper.WriteJSON(w, server.Result{
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
		db.InsertOne(server.ConfigCollectionName, doc1)
		db.FindOne(server.ConfigCollectionName, bson.M{}, &config)
	}

	result := Result{
		ID:                   config.ID,
		EnableAuthority:      server.Config.Authority.Enabled,
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
		EnableRemoteEdit:     server.Config.Remote.Enabled,
		WebSocketServerPort:  server.Config.Remote.WebSocketPort,
	}

	user, _ := server.GetCurrentUser(r)

	if user != nil {
		result.IsLogin = true
		result.Username = user.Username
		result.Name = user.Name
		result.RoleID = user.RoleID
		result.RoleName = user.RoleName
		result.DeptID = user.DeptID
		result.DeptName = user.DeptName
		result.OperatingAuthorities = user.OperatingAuthorities
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: result,
	})
}

// Result config to front end
type Result struct {
	// ID
	ID string
	// Enable Authority
	EnableAuthority bool
	// Has Initialized
	Initialized bool
	// Default Register Role
	DefaultRegisterRole string
	// Is Login
	IsLogin bool
	// Username
	Username string
	// Name
	Name string
	// Role ID
	RoleID string
	// Role Name
	RoleName string
	// Department ID
	DeptID string
	// Department Name
	DeptName string
	// Operating Authorities
	OperatingAuthorities []string
	// Enable Remote Edit
	EnableRemoteEdit bool
	// Web Socket Server Port
	WebSocketServerPort int
}
