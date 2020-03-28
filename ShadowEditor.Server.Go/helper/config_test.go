package helper

import "testing"

func TestConfig(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(config)
}
