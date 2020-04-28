package encoder

import (
	"unsafe"

	jsoniter "github.com/json-iterator/go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ObjectIDEncoder is a custom primitive.ObjectID encoder.
type ObjectIDEncoder struct {
}

// Encode encode ObjectID to string.
func (ObjectIDEncoder) Encode(ptr unsafe.Pointer, stream *jsoniter.Stream) {
	val := (*primitive.ObjectID)(ptr)
	stream.WriteString(val.Hex())
}

// IsEmpty detect whether primitive.ObjectID is empty.
func (ObjectIDEncoder) IsEmpty(ptr unsafe.Pointer) bool {
	val := (*primitive.ObjectID)(ptr)
	return val.IsZero()
}
