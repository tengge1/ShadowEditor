// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import "testing"

func TestConfig(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}
	t.Logf("server.port: %v", config.Server.Port)

	t.Logf("database.type: %v", config.Database.Type)
	t.Logf("database.connection: %v", config.Database.Connection)
	t.Logf("database.database: %v", config.Database.Database)

	t.Logf("authority.enabled: %v", config.Authority.Enabled)
	t.Logf("authority.expires: %v", config.Authority.Expires)

	t.Logf("upload.max_size: %v", config.Upload.MaxSize)

	t.Logf("remote.enabled: %v", config.Remote.Enabled)
	t.Logf("remote.web_socket_port: %v", config.Remote.WebSocketPort)

	t.Logf("path.public_dir: %v", config.Path.PublicDir)
	t.Logf("path.upload_dir: %v", config.Path.UploadDir)
	t.Logf("path.log_dir: %v", config.Path.LogDir)

	t.Logf("log.file: %v", config.Log.File)
}
