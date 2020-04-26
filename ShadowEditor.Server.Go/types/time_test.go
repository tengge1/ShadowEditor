package types

import (
	"encoding/json"
	"testing"
	"time"
)

func TestTime(t *testing.T) {
	date := Time(time.Date(2020, 4, 26, 21, 38, 12, 0, time.Local))

	bytes, err := json.Marshal(date)
	if err != nil {
		t.Error(err)
		return
	}

	str := string(bytes)
	expected := "\"2020-04-26 21:38:12\""
	if str != expected {
		t.Errorf("expect %v, got %v", expected, str)
	}
}
