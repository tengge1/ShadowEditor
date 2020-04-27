package helper

import (
	"reflect"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	coder "github.com/tengge1/shadoweditor/helper/json"
)

// ToJSON convert interface{} to json bytes.
func ToJSON(obj interface{}) ([]byte, error) {
	builder := bson.NewRegistryBuilder()

	builder.RegisterEncoder(reflect.TypeOf(time.Now()), coder.TimeEncoder{})
	builder.RegisterEncoder(reflect.TypeOf(primitive.NilObjectID), coder.ObjectIDEncoder{})

	bytes, err := bson.MarshalExtJSONWithRegistry(builder.Build(), obj, false, false)
	if err != nil {
		return nil, err
	}

	return bytes, nil
}

// FromJSON convert json bytes to interface{}.
func FromJSON(bytes []byte, result interface{}) error {
	builder := bson.NewRegistryBuilder()

	builder.RegisterDecoder(reflect.TypeOf(time.Now()), coder.TimeDecoder{})
	//builder.RegisterDecoder(reflect.TypeOf(primitive.NilObjectID()), coder.TimeDecoder{})

	return bson.UnmarshalExtJSONWithRegistry(builder.Build(), bytes, false, result)
}
