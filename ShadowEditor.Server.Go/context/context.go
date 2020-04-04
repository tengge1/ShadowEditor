package context

import (
	"fmt"

	"github.com/tengge1/shadoweditor/helper"
)

var (
	// Config config cache
	Config *helper.ConfigModel
)

// Create create a context
func Create(path string) error {
	config, err := helper.GetConfig(path)
	if err != nil {
		return err
	}
	Config = config
	return nil
}

// Mongo get a new mongo client
func Mongo() (*helper.Mongo, error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	return helper.NewMongo(Config.Database.Connection, Config.Database.Database)
}
