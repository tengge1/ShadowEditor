// Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
//
// For more information, please visit: https://github.com/tengge1/ShadowEditor
// You can also visit: https://gitee.com/tengge1/ShadowEditor

package encoder

import (
	"fmt"
	"strconv"
	"time"
	"unsafe"

	jsoniter "github.com/json-iterator/go"
)

// TimeEncoder is a custom time.Time encoder.
type TimeEncoder struct {
}

// Encode encode time.Time to `yyyy-MM-dd HH:mm:ss` format.
func (TimeEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	val := (*time.Time)(ptr)

	year := strconv.Itoa(val.Year())
	month := strconv.Itoa(int(val.Month()))
	day := strconv.Itoa(val.Day())
	hour := strconv.Itoa(val.Hour())
	minute := strconv.Itoa(val.Minute())
	second := strconv.Itoa(val.Second())

	if len(month) < 2 {
		month = "0" + month
	}
	if len(day) < 2 {
		day = "0" + day
	}
	if len(hour) < 2 {
		hour = "0" + hour
	}
	if len(minute) < 2 {
		minute = "0" + minute
	}
	if len(second) < 2 {
		second = "0" + second
	}

	str := fmt.Sprintf("%v-%v-%v %v:%v:%v", year, month, day, hour, minute, second)

	stream.WriteString(str)
}

// IsEmpty detect whether time.Time is empty.
func (TimeEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	return false
}
