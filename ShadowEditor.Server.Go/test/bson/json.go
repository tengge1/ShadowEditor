package main

import (
	"fmt"
	"reflect"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func main() {
	bs := bson.M{
		"Data": bson.A{
			primitive.D{
				{Key: "_id", Value: primitive.NewObjectID()},
				{Key: "name", Value: "xiaoming"},
				{Key: "age", Value: 18},
			},
		},
	}

	r := bson.NewRegistryBuilder()

	r.RegisterEncoder(reflect.TypeOf(primitive.NewObjectID()), ObjectIDEncoder{})

	bytes, err := bson.MarshalExtJSONWithRegistry(r.Build(), bs, false, false)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(bytes))
}

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
