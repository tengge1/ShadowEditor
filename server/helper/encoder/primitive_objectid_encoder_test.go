package encoder

import (
	"reflect"
	"testing"

	jsoniter "github.com/json-iterator/go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestPrimitiveObjectIDEncoder(t *testing.T) {
	jsoniter.RegisterTypeEncoder(
		reflect.TypeOf(primitive.NewObjectID()).String(),
		PrimitiveObjectIDEncoder{},
	)

	val, err := primitive.ObjectIDFromHex("5ea82000e8cbe4f02f0259ab")
	if err != nil {
		t.Error(err.Error())
	}

	bytes, err := jsoniter.Marshal(val)
	if err != nil {
		t.Error(err)
	}

	got := string(bytes)
	expect := `"5ea82000e8cbe4f02f0259ab"`
	if got != expect {
		t.Errorf("expect %v, got %v", expect, got)
	}
}
