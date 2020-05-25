// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package server

// Result present a server handler result.
type Result struct {
	// The Response Code: 200 - ok; 300 -error; 301 - not authorized.
	Code int `json:"Code" bson:"Code"`
	// The Response Message
	Msg string `json:"Msg" bson:"Msg"`
	// The Response Data
	Data interface{} `json:"Data,omitempty" bson:"Data,omitempty"`
}
