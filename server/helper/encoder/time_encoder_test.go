package encoder

import (
	"reflect"
	"testing"
	"time"

	jsoniter "github.com/json-iterator/go"
)

func TestTimeEncoder(t *testing.T) {
	jsoniter.RegisterTypeEncoder(
		reflect.TypeOf(time.Now()).String(),
		TimeEncoder{},
	)

	val := time.Date(2020, 5, 23, 21, 30, 12, 0, time.Local)

	bytes, err := jsoniter.Marshal(val)
	if err != nil {
		t.Error(err)
	}

	got := string(bytes)
	expect := `"2020-05-23 21:30:12"`
	if got != expect {
		t.Errorf("expect %v, got %v", expect, got)
	}
}
