package json

import (
	"fmt"
	"reflect"
	"strconv"

	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
)

// TimeEncoder is a custom time.Time encoder.
type TimeEncoder struct {
}

// EncodeValue encode time.Time to `yyyy-MM-dd HH:mm:ss` format.
func (TimeEncoder) EncodeValue(context bsoncodec.EncodeContext, vw bsonrw.ValueWriter, val reflect.Value) error {
	year := val.MethodByName("Year").Call([]reflect.Value{})[0].Int()
	month := val.MethodByName("Month").Call([]reflect.Value{})[0].Int()
	day := val.MethodByName("Day").Call([]reflect.Value{})[0].Int()
	hour := val.MethodByName("Hour").Call([]reflect.Value{})[0].Int()
	minute := val.MethodByName("Minute").Call([]reflect.Value{})[0].Int()
	second := val.MethodByName("Second").Call([]reflect.Value{})[0].Int()

	syear := strconv.FormatInt(year, 10)
	smonth := strconv.FormatInt(month, 10)
	sday := strconv.FormatInt(day, 10)
	shour := strconv.FormatInt(hour, 10)
	sminute := strconv.FormatInt(minute, 10)
	ssecond := strconv.FormatInt(second, 10)

	if len(smonth) < 2 {
		smonth = "0" + smonth
	}
	if len(sday) < 2 {
		sday = "0" + sday
	}
	if len(shour) < 2 {
		shour = "0" + shour
	}
	if len(sminute) < 2 {
		sminute = "0" + sminute
	}
	if len(ssecond) < 2 {
		ssecond = "0" + ssecond
	}

	str := fmt.Sprintf("%v-%v-%v %v:%v:%v", syear, smonth, sday, shour, sminute, ssecond)

	return vw.WriteString(str)
}
