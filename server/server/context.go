// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"os"
	"path/filepath"

	"github.com/sirupsen/logrus"
	"github.com/tengge1/shadoweditor/server/helper"
)

// We cache the shared data used by the server, such as `Config` and `Logger`.

var (
	// Config is the config cache.
	Config *helper.ConfigModel
	// Logger is the server logger.
	Logger *logrus.Logger
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
	dir := filepath.Dir(config.Log.File)
	if _, err = os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	writer, err := os.OpenFile(config.Log.File, os.O_RDONLY|os.O_CREATE|os.O_APPEND, 0755)
	if err != nil {
		panic(err.Error())
	}

	logger := &logrus.Logger{
		Out:       writer,
		Formatter: new(logrus.JSONFormatter),
		Hooks:     make(logrus.LevelHooks),
		Level:     logrus.DebugLevel,
	}

	Logger = logger

	return nil
}
