package encoder

import (
	"reflect"
	"testing"

	jsoniter "github.com/json-iterator/go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestPrimitiveDEncoder(t *testing.T) {
	jsoniter.RegisterTypeEncoder(
		reflect.TypeOf(primitive.D{}).String(),
		PrimitiveDEncoder{},
	)

	val := primitive.D{
		{Key: "foo", Value: "bar"},
		{Key: "hello", Value: "world"},
	}

	bytes, err := jsoniter.Marshal(val)
	if err != nil {
		t.Error(err)
	}

	got := string(bytes)
	expect := `{"foo":"bar","hello":"world"}`
	if got != expect {
		t.Errorf("expect %v, got %v", expect, got)
	}
}
