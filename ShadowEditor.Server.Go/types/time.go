package types

import (
	"fmt"
	"strconv"
	"time"
)

// Time is time.Time that can marshal to json.
type Time time.Time

// MarshalJSON marshal time to json bytes.
func (t Time) MarshalJSON() ([]byte, error) {
	tt := time.Time(t)

	year := strconv.Itoa(tt.Year())
	month := strconv.Itoa(int(tt.Month()))
	day := strconv.Itoa(tt.Day())

	if len(month) < 2 {
		month = "0" + month
	}

	if len(day) < 2 {
		day = "0" + day
	}

	hour := strconv.Itoa(tt.Hour())
	minute := strconv.Itoa(tt.Minute())
	second := strconv.Itoa(tt.Second())

	if len(hour) < 2 {
		hour = "0" + hour
	}

	if len(minute) < 2 {
		minute = "0" + minute
	}

	if len(second) < 2 {
		second = "0" + second
	}

	return []byte(fmt.Sprintf("\"%v-%v-%v %v:%v:%v\"", year, month, day, hour, minute, second)), nil
}
