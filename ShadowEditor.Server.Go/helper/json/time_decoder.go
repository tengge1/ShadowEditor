package json

import (
	"reflect"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
)

// TimeDecoder is a custom time.Time decoder.
type TimeDecoder struct {
}

// DecodeValue decode `yyyy-MM-dd HH:mm:ss` format string bytes to time.Time.
func (TimeDecoder) DecodeValue(context bsoncodec.DecodeContext, vr bsonrw.ValueReader, val reflect.Value) error {
	str, err := vr.ReadString()
	if err != nil {
		return nil
	}

	ps := strings.Split(str, " ")
	ds := strings.Split(ps[0], "-")
	ts := strings.Split(ps[1], ":")

	year, err := strconv.Atoi(ds[0])
	month, err := strconv.Atoi(ds[1])
	day, err := strconv.Atoi(ds[2])
	hour, err := strconv.Atoi(ts[0])
	minute, err := strconv.Atoi(ts[1])
	second, err := strconv.Atoi(ts[2])

	tm := time.Date(year, time.Month(month), day, hour, minute, second, 0, time.Local)
	val.Set(reflect.ValueOf(tm))

	return nil
}
