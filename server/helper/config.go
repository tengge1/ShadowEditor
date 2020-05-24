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
	"runtime"
	"strings"

	"github.com/BurntSushi/toml"
)

// GetConfig read toml format file `config.toml`, and parse ConfigModel.
//
// See: https://github.com/toml-lang/toml
func GetConfig(path string) (config *ConfigModel, err error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	if _, err = toml.DecodeReader(file, &config); err != nil {
		return nil, err
	}

	// parse mongoDB connection string.
	if config.Database.User != "" && config.Database.Password != "" {
		// If user is empty, this will cause `error parsing uri: authsource without username is invalid` error.
		config.Database.Connection = fmt.Sprintf(
			"mongodb://%v:%v@%v:%v",
			config.Database.User,
			config.Database.Password,
			config.Database.Host,
			config.Database.Port,
		)
	} else {
		config.Database.Connection = fmt.Sprintf(
			"mongodb://%v:%v",
			config.Database.Host,
			config.Database.Port,
		)
	}

	// In windows system, path separator "/" should be replace with "\\".
	if strings.HasPrefix(runtime.GOOS, "windows") {
		config.Path.PublicDir = strings.ReplaceAll(config.Path.PublicDir, "/", "\\")
		config.Path.LogDir = strings.ReplaceAll(config.Path.LogDir, "/", "\\")
	}

	return
}

// ConfigModel is the structure of file `config.toml`.
type ConfigModel struct {
	Server    ServerConfigModel    `toml:"server"`
	Database  DatabaseConfigModel  `toml:"database"`
	Authority AuthorityConfigModel `toml:"authority"`
	Upload    UploadConfigModel    `toml:"upload"`
	Remote    RemoteConfigModel    `toml:"remote"`
	Path      PathConfigModel      `toml:"path"`
	Log       LogConfigModel       `toml:"log"`
}

// ServerConfigModel is the server config section in `config.toml`.
type ServerConfigModel struct {
	Port string `toml:"port"`
}

// DatabaseConfigModel is the database config section in `config.toml`.
type DatabaseConfigModel struct {
	Type     string `toml:"type"`
	Host     string `toml:"host"`
	Port     int    `toml:"port"`
	User     string `toml:"user"`
	Password string `toml:"password"`
	Database string `toml:"database"`

	// Connection should not read from config.toml.
	Connection string
}

// AuthorityConfigModel is the authority config section in `config.toml`.
type AuthorityConfigModel struct {
	Enabled   bool   `toml:"enabled"`
	Expires   int    `toml:"expires"`
	SecretKey string `toml:"secret_key"`
}

// UploadConfigModel is the upload config section in `config.toml`.
type UploadConfigModel struct {
	MaxSize int64 `toml:"max_size"`
}

// RemoteConfigModel is the remote config section in `config.toml`.
type RemoteConfigModel struct {
	Enabled       bool `toml:"enabled"`
	WebSocketPort int  `toml:"web_socket_port"`
}

// PathConfigModel is the authority path section in `config.toml`.
type PathConfigModel struct {
	PublicDir string `toml:"public_dir"`
	LogDir    string `toml:"log_dir"`
}

// LogConfigModel is the log config section in `config.toml`.
type LogConfigModel struct {
	File string `toml:"file"`
}
