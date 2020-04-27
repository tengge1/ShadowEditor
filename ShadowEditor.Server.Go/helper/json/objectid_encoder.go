package json

import (
	"reflect"

	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
)

// ObjectIDEncoder is a custom ObjectID encoder.
type ObjectIDEncoder struct {
}

// EncodeValue encode ObjectID to string.
func (ObjectIDEncoder) EncodeValue(context bsoncodec.EncodeContext, vw bsonrw.ValueWriter, val reflect.Value) error {
	hex := val.MethodByName("Hex")
	result := hex.Call([]reflect.Value{})

	str := result[0].String()

	return vw.WriteString(str)
}
