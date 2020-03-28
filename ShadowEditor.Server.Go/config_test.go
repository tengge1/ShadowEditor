package main

import (
	"os"
	"testing"

	"github.com/spf13/viper"
)

func TestConfig(t *testing.T) {
	file, err := os.Open("./config.toml")
	if err != nil {
		t.Error(err)
		return
	}

	viper.SetConfigType("toml")

	err = viper.ReadConfig(file)
	if err != nil {
		t.Error(err)
		return
	}

	data := viper.Get("database").(map[string]interface{})
	t.Log(data["type"])
}
