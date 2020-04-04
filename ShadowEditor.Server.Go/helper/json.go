package helper

import (
	"encoding/json"
)

// ToJSON object to json
func ToJSON(obj interface{}) ([]byte, error) {
	return json.Marshal(obj)
}

// FromJSON json to object
func FromJSON(bytes []byte, result interface{}) error {
	return json.Unmarshal(bytes, result)
}
