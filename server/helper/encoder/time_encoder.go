// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package encoder

import (
	"time"
	"unsafe"

	jsoniter "github.com/json-iterator/go"
)

// TimeEncoder is a custom time.Time encoder.
type TimeEncoder struct {
}

// Encode encode time.Time to `yyyy-MM-dd HH:mm:ss` format.
//
// // See: github.com/tengge1/shadoweditor/helper/json.go
func (TimeEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	val := (*time.Time)(ptr)

	str := val.Format("2006-01-02 15:04:05")

	stream.WriteString(str)
}

// IsEmpty detect whether time.Time is empty.
func (TimeEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	return false
}
