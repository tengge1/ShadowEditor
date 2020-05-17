// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"fmt"

	"github.com/tengge1/shadoweditor/server/helper"
)

// Mongo create a new mongo client.
func Mongo() (*helper.Mongo, error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	return helper.NewMongo(Config.Database.Connection, Config.Database.Database)
}
