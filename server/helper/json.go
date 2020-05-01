// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	jsoniter "github.com/json-iterator/go"

	"github.com/tengge1/shadoweditor/server/helper/encoder"
)

func init() {
	jsoniter.RegisterTypeEncoder("time.Time", encoder.TimeEncoder{})
	jsoniter.RegisterTypeEncoder(
		"go.mongodb.org/mongo-driver/bson/primitive.ObjectID",
		encoder.ObjectIDEncoder{},
	)
}

// ToJSON convert interface{} to json bytes.
func ToJSON(obj interface{}) ([]byte, error) {
	return jsoniter.Marshal(obj)
}

// FromJSON convert json bytes to interface{}.
func FromJSON(bytes []byte, result interface{}) error {
	return jsoniter.Unmarshal(bytes, result)
}
