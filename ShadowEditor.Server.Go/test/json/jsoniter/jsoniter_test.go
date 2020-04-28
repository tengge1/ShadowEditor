package main

import (
	"fmt"
	"strconv"
	"testing"
	"time"
	"unsafe"

	"go.mongodb.org/mongo-driver/bson/primitive"

	jsoniter "github.com/json-iterator/go"
)

func TestJsonIter(t *testing.T) {
	data := map[string]interface{}{
		"foo": 1, // float64
		"bar": []interface{}{
			"hello",
			123, // float64
		},
		"time": time.Date(2020, 4, 27, 20, 34, 10, 0, time.Local),
		"id":   primitive.NewObjectID(),
	}

	jsoniter.RegisterTypeEncoder("time.Time", timeEncoder{})

	json := jsoniter.ConfigCompatibleWithStandardLibrary
	bytes, err := json.Marshal(&data)
	if err != nil {
		panic(err)
	}

	fmt.Println(string(bytes))
}

type timeEncoder struct {
}

func (timeEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
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

func (timeEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	return false
}
