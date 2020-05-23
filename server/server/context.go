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

	"github.com/sirupsen/logrus"
	"github.com/tengge1/shadoweditor/helper"
)

// We cache the shared data used by the server, such as `Config` and `Logger`.

var (
	// Config is the config cache.
	Config *helper.ConfigModel
	// Logger is the server logger.
	Logger *logrus.Logger
	// defaultTimeFormat is the default formater to format time in the logs.
	defaultTimeFormat = "2006-01-02T15:04:05Z07:00"
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

	writer, err := os.OpenFile(config.Log.File, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0755)
	if err != nil {
		panic(err.Error())
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

// logFormatter is a custom formatter to output logs to a file.
type logFormatter struct {
}

func (l logFormatter) Format(e *logrus.Entry) ([]byte, error) {
	str := fmt.Sprintf("%v [%v] %v\n", e.Time.Format(defaultTimeFormat), e.Level, e.Message)
	return []byte(str), nil
}
