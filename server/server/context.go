// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
	"github.com/tengge1/shadoweditor/helper"
)

var (
	// Config caches all the setting information we get from config.toml.
	Config *helper.ConfigModel
	// Logger saves the running information of the server to a log file.
	//
	// IMPORTANT: DO NOT use Logger.Fatal or Logger.Panic, it may cause the
	// programs exit.
	Logger *logrus.Logger
)

// Create create the server context, such as Config and Logger.
func Create(path string) error {
	// parse ConfigModel
	config, err := helper.GetConfig(path)
	if err != nil {
		return err
	}
	Config = config

	// create context Logger
	dir := filepath.Dir(config.Log.File)
	if _, err = os.Stat(dir); os.IsNotExist(err) {
		os.MkdirAll(dir, 0755)
	}

	writer, err := os.OpenFile(config.Log.File, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0755)
	if err != nil {
		return err
	}

	logger := &logrus.Logger{
		Out:       writer,
		Formatter: new(logFormatter),
		Hooks:     make(logrus.LevelHooks),
		Level:     logrus.DebugLevel,
	}

	Logger = logger

	return nil
}

// Mongo create a new mongo client.
func Mongo() (*helper.Mongo, error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	mong, err := helper.NewMongo(Config.Database.Connection, Config.Database.Database)
	if err != nil && Logger != nil {
		Logger.Error(err)
	}
	return mong, err
}

// MapPath maps a relative path to a physical absolute path. The root path `/` means
// the public_dir in config.toml. Empty path is equal to the root path.
func MapPath(path string) string {
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	path = filepath.Join(Config.Path.PublicDir, path)
	return strings.ReplaceAll(path, "/", string(filepath.Separator))
}

// logFormatter is a custom formatter to output logs to a file.
type logFormatter struct {
}

func (l logFormatter) Format(e *logrus.Entry) ([]byte, error) {
	str := fmt.Sprintf("%v [%v] %v\n", e.Time.Format(time.RFC3339), e.Level, e.Message)
	return []byte(str), nil
}
