// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package helper

import (
	"reflect"
	"time"

	jsoniter "github.com/json-iterator/go"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper/encoder"
)

// Register custom type encoder here.
func init() {
	jsoniter.RegisterTypeEncoder(reflect.TypeOf(time.Now()).String(), encoder.TimeEncoder{})
	jsoniter.RegisterTypeEncoder(
		reflect.TypeOf(primitive.NewObjectID()).String(),
		encoder.PrimitiveObjectIDEncoder{},
	)
	jsoniter.RegisterTypeEncoder(
		reflect.TypeOf(primitive.D{}).String(),
		encoder.PrimitiveDEncoder{},
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
