// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package encoder

import (
	"unsafe"

	jsoniter "github.com/json-iterator/go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// PrimitiveObjectIDEncoder is a custom primitive.ObjectID encoder.
//
// See: github.com/tengge1/shadoweditor/helper/json.go
type PrimitiveObjectIDEncoder struct {
}

// Encode encode primitive.ObjectID to string.
func (PrimitiveObjectIDEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	val := (*primitive.ObjectID)(ptr)
	stream.WriteString(val.Hex())
}

// IsEmpty detect whether primitive.ObjectID is empty.
func (PrimitiveObjectIDEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	val := (*primitive.ObjectID)(ptr)
	return val.IsZero()
}
