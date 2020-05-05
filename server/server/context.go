// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"fmt"

	"github.com/tengge1/shadoweditor/helper"
)

// We cache the shared data used by the server, such as `Config` and `Logger`.

var (
	// Config is the config cache.
	Config *helper.ConfigModel
	// Logger is the server logger.
	Logger *helper.Logger
)

// Create create the server context.
func Create(path string) error {
	// config
	config, err := helper.GetConfig(path)
	if err != nil {
		return err
	}
	Config = config

	// logger
	logger, err := helper.NewLogger(config.Log.File)
	if err != nil {
		return err
	}
	Logger = logger

	return nil
}

// Mongo create a new mongo client.
func Mongo() (*helper.Mongo, error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	return helper.NewMongo(Config.Database.Connection, Config.Database.Database)
}
