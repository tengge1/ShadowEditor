package helper

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"reflect"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsoncodec"
	"go.mongodb.org/mongo-driver/bson/bsonrw"
)

// Get make a get request
func Get(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// Post make a post request
func Post(url string, data url.Values) ([]byte, error) {
	resp, err := http.PostForm(url, data)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return ioutil.ReadAll(resp.Body)
}

// Write write a string to http response
func Write(w http.ResponseWriter, args ...interface{}) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprint(args...)))
}

// Writef write a string to http response
func Writef(w http.ResponseWriter, format string, args ...interface{}) {
	header := w.Header()

	header.Set("Content-Type", "text/plain")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	w.Write([]byte(fmt.Sprint(args...)))
}

// WriteJSON write a json to http response
func WriteJSON(w http.ResponseWriter, obj interface{}) error {
	header := w.Header()

	header.Set("Content-Type", "application/json")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	bytes, err := ToJSON(obj)
	if err != nil {
		return err
	}

	w.Write(bytes)

	return nil
}

// WriteBSON write a bson to http response
func WriteBSON(w http.ResponseWriter, obj interface{}) error {
	header := w.Header()

	header.Set("Content-Type", "application/json")
	header.Set("Cache-Control", "no-cache, no-store, must-revalidate")
	header.Set("Pragma", "no-cache")
	header.Set("Expires", "0")

	builder := bson.NewRegistryBuilder()
	builder.RegisterEncoder(reflect.TypeOf(primitive.NilObjectID), ObjectIDEncoder{})

	bytes, err := bson.MarshalExtJSONWithRegistry(builder.Build(), obj, false, false)
	if err != nil {
		return err
	}

	w.Write(bytes)

	return nil
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
