package main

import (
	"fmt"
	"reflect"
	"unsafe"

	"go.mongodb.org/mongo-driver/bson/primitive"

	jsoniter "github.com/json-iterator/go"
)

func main() {
	data := primitive.D{
		{Key: "foo", Value: "bar"},
		{Key: "hello", Value: "world"},
	}

	jsoniter.RegisterTypeEncoder(reflect.TypeOf(primitive.D{}).String(), PrimitiveDEncoder{})

	bytes, err := jsoniter.Marshal(data)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(bytes))
}

// PrimitiveDEncoder is a custom primitive.D encoder.
type PrimitiveDEncoder struct {
}

// Encode encode primitive.D to string.
func (PrimitiveDEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	fmt.Println("DEBUG: custom marshal primitive.D")

	val := (*primitive.D)(ptr)
	stream.WriteVal(val.Map())
}

// IsEmpty detect whether primitive.ObjectID is empty.
func (PrimitiveDEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	fmt.Println("DEBUG: custom marshal primitive.D")

	return false
}
