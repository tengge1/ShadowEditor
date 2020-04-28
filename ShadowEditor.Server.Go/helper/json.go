package helper

import (
	jsoniter "github.com/json-iterator/go"

	"github.com/tengge1/shadoweditor/helper/encoder"
)

func init() {
	jsoniter.RegisterTypeEncoder("time.Time", encoder.TimeEncoder{})
	jsoniter.RegisterTypeEncoder(
		"go.mongodb.org/mongo-driver/bson/primitive.ObjectID",
		encoder.ObjectIDEncoder{},
	)
}

// ToJSON convert interface{} to json bytes.
func ToJSON(obj interface{}) ([]byte, error) {
	return jsoniter.Marshal(obj)
}

// FromJSON convert json bytes to interface{}.
func FromJSON(bytes []byte, result interface{}) error {
	return jsoniter.Unmarshal(bytes, result)
}
