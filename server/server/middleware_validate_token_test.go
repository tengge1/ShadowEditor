package server

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/tengge1/shadoweditor/server/system"
	"go.mongodb.org/mongo-driver/bson"
)

func TestValidateTokenMiddleware(t *testing.T) {
	// read config
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
	// test handler
	hello := "Hello, world!"
	handler := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(hello))
	}
	// test server
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ValidateTokenMiddleware(w, r, handler)
	}))
	defer ts.Close()
	// get response
	resp, err := http.Get(ts.URL)
	if err != nil {
		t.Error(err)
	}
	defer resp.Body.Close()
}

func TestCanInitialize(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	mong, err := Mongo()
	if err != nil {
		t.Error(err)
	}
	_, err = mong.ListCollectionNames()
	if err != nil {
		t.Error(err)
	}
	// save old config
	oldInitialized := false
	config := system.Config{}
	find, err := mong.FindOne(ConfigCollectionName, bson.M{}, &config)
	if err != nil {
		t.Error(err)
	}
	if find {
		oldInitialized = config.Initialized
	}
	// set Initialized to false
	if find {
		update := bson.M{
			"$set": bson.M{
				"Initialized": false,
			},
		}
		if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
			t.Error(err)
		}
	} else {
		config.Initialized = false
		if _, err = mong.InsertOne(ConfigCollectionName, config); err != nil {
			t.Error(err)
		}
	}
	if canInitialize() != true {
		t.Errorf("expect true, got false")
	}
	// set Initialized to true
	update := bson.M{
		"$set": bson.M{
			"Initialized": true,
		},
	}
	if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
		t.Error(err)
	}
	if canInitialize() != false {
		t.Errorf("expect false, got true")
	}
	// restore initial record
	if find {
		update := bson.M{
			"$set": bson.M{
				"Initialized": oldInitialized,
			},
		}
		if _, err = mong.UpdateOne(ConfigCollectionName, bson.M{}, update); err != nil {
			t.Error(err)
		}
	} else {
		if _, err = mong.DeleteAll(ConfigCollectionName); err != nil {
			t.Error(err)
		}
	}
}

func TestLogAPI(t *testing.T) {
	// read config
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
	}
	if Config == nil {
		t.Errorf("config is nil")
	}
	// set a temp file as log file
	file, err := ioutil.TempFile(os.TempDir(), "*.txt")
	if err != nil {
		t.Error(err)
	}
	defer file.Close()
	Logger.SetOutput(file)
	// write logs
	logAPI("/foo", SaveScene, "hello", true)
	logAPI("/foo/bar", None, "", false)
	// read logs
	bytes, err := ioutil.ReadFile(file.Name())
	if err != nil {
		t.Error(err)
	}
	lines := strings.Split(string(bytes), "\n")
	if len(lines) == 0 {
		t.Errorf("expect greater than 0, got 0")
	}
	line0 := "/foo SAVE_SCENE hello Success"
	if !strings.Contains(lines[0], line0) {
		t.Errorf("%v is not find in line 0", line0)
	}
	line1 := "/foo/bar NONE guest Fail"
	if !strings.Contains(lines[1], "") {
		t.Errorf("%v is not find in line 1", line1)
	}
}
