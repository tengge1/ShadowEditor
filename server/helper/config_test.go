// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"fmt"
	"os"
	"testing"

	"github.com/spf13/viper"
)

func TestConfig(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
	}

	// We use another toml parser to test GetConfig.
	file, err := os.Open("../config.toml")
	if err != nil {
		t.Error(err.Error())
	}

	defer file.Close()

	viper.SetConfigType("toml")

	if err := viper.ReadConfig(file); err != nil {
		t.Error(err.Error())
	}

	// server section
	{
		server := viper.Sub("server")
		port := server.GetString("port")

		if config.Server.Port != port {
			t.Errorf("expect %v, got %v", port, config.Server.Port)
		}
	}

	// database section
	{
		database := viper.Sub("database")
		typ := database.GetString("type")
		host := database.GetString("host")
		port := database.GetInt64("port")
		user := database.GetString("user")
		password := database.GetString("password")
		databaseName := database.GetString("database")

		if config.Database.Type != typ {
			t.Errorf("expect %v, got %v", typ, config.Database.Type)
		}

		if config.Database.Host != host {
			t.Errorf("expect %v, got %v", host, config.Database.Host)
		}

		if config.Database.Port != int(port) {
			t.Errorf("expect %v, got %v", port, config.Database.Port)
		}

		if config.Database.User != user {
			t.Errorf("expect %v, got %v", user, config.Database.User)
		}

		if config.Database.Password != password {
			t.Errorf("expect %v, got %v", password, config.Database.Password)
		}

		if config.Database.Database != databaseName {
			t.Errorf("expect %v, got %v", databaseName, config.Database.Database)
		}

		connection := fmt.Sprintf("mongodb://%v:%v", host, port)
		if config.Database.Connection != connection {
			t.Errorf("expect %v, got %v", connection, config.Database.Connection)
		}
	}

	// authority section
	{
		authority := viper.Sub("authority")
		enabled := authority.GetBool("enabled")
		expires := authority.GetInt64("expires")
		secretKey := authority.GetString("secret_key")

		if config.Authority.Enabled != enabled {
			t.Errorf("expect %v, got %v", enabled, config.Authority.Enabled)
		}

		if config.Authority.Expires != int(expires) {
			t.Errorf("expect %v, got %v", expires, config.Authority.Expires)
		}

		if config.Authority.SecretKey != secretKey {
			t.Errorf("expect %v, got %v", secretKey, config.Authority.SecretKey)
		}
	}

	// upload section
	{
		upload := viper.Sub("upload")
		maxSize := upload.GetInt64("max_size")

		if config.Upload.MaxSize != maxSize {
			t.Errorf("expect %v, got %v", maxSize, config.Upload.MaxSize)
		}
	}

	// remote section
	{
		remote := viper.Sub("remote")
		enabled := remote.GetBool("enabled")
		webSocketPort := remote.GetInt64("web_socket_port")

		if config.Remote.Enabled != enabled {
			t.Errorf("expect %v, got %v", enabled, config.Remote.Enabled)
		}

		if config.Remote.WebSocketPort != int(webSocketPort) {
			t.Errorf("expect %v, got %v", webSocketPort, config.Remote.WebSocketPort)
		}
	}

	// path section
	{
		path := viper.Sub("path")
		publicDir := path.GetString("public_dir")
		logDir := path.GetString("log_dir")

		if config.Path.PublicDir != publicDir {
			t.Errorf("expect %v, got %v", publicDir, config.Path.PublicDir)
		}

		if config.Path.LogDir != logDir {
			t.Errorf("expect %v, got %v", logDir, config.Path.LogDir)
		}
	}

	// log section
	{
		log := viper.Sub("log")
		file := log.GetString("file")

		if config.Log.File != file {
			t.Errorf("expect %v, got %v", file, config.Log.File)
		}
	}
}
