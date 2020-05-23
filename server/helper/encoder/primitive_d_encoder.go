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

// PrimitiveDEncoder is a custom primitive.D encoder.
//
// See: github.com/tengge1/shadoweditor/helper/json.go
type PrimitiveDEncoder struct {
}

// Encode encode primitive.D to string.
func (PrimitiveDEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	val := (*primitive.D)(ptr)
	stream.WriteVal(val.Map())
}

// IsEmpty detect whether primitive.ObjectID is empty.
func (PrimitiveDEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	return false
}
