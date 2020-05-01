// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import "testing"

func TestNewLog(t *testing.T) {
	logger, err := NewLogger("../../Logs/ShadowServer.txt")
	if err != nil {
		t.Error(err)
		return
	}
	logger.Debug("This is a debug.")
	logger.Info("This is an info.")
	logger.Warn("This is a warn.")
	logger.Error("This is an error.")
	logger.Fatal("This is a fatal.")

	logger.Debugf("This is a debug. %v %v", "foo", 123)
	logger.Infof("This is an info. %v %v", "foo", 123)
	logger.Warnf("This is a warn. %v %v", "foo", 123)
	logger.Errorf("This is an error. %v %v", "foo", 123)
	logger.Fatalf("This is a fatal. %v %v", "foo", 123)
}
