package server

import (
	"io/ioutil"
	"os"
	"strings"
	"testing"
)

func TestValidateTokenMiddleware(t *testing.T) {

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
