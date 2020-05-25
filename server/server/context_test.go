// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestConfig(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
}

func TestLogger(t *testing.T) {
	// read config
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
	// set a temp file as log file
	file, err := ioutil.TempFile(os.TempDir(), "*.txt")
	if err != nil {
		t.Error(err)
	}
	defer file.Close()
	Logger.SetOutput(file)
	// write logs
	debugMsg := "Debug from TestLogger."
	infoMsg := "Info from TestLogger."
	warnMsg := "Warn from TestLogger."
	errMsg := "Error from TestLogger."
	Logger.Debug(debugMsg)
	Logger.Info(infoMsg)
	Logger.Warn(warnMsg)
	Logger.Error(errMsg)
	// read logs
	bytes, err := ioutil.ReadFile(file.Name())
	if err != nil {
		t.Error(err)
	}
	lines := strings.Split(string(bytes), "\n")
	if len(lines) == 0 {
		t.Errorf("expect greater than 0, got 0")
	}
	if !strings.Contains(lines[0], debugMsg) {
		t.Errorf("%v is not find in line 0", debugMsg)
	}
	if !strings.Contains(lines[1], infoMsg) {
		t.Errorf("%v is not find in line 1", infoMsg)
	}
	if !strings.Contains(lines[2], warnMsg) {
		t.Errorf("%v is not find in line 2", warnMsg)
	}
	if !strings.Contains(lines[3], errMsg) {
		t.Errorf("%v is not find in line 3", errMsg)
	}
}

func TestMapPath(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	url := "/Upload/texture/test.jpg"
	path := MapPath(url)
	expected := filepath.Join(Config.Path.PublicDir, url)
	expected = strings.ReplaceAll(expected, "/", string(filepath.Separator))
	if expected != path {
		t.Errorf("expect %v, got %v", expected, path)
	}
}

func TestMongo(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}

	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}

	_, err = mong.ListCollectionNames()
	if err != nil {
		t.Error(err)
	}
}
