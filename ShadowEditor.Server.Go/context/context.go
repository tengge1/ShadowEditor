package context

import (
	"fmt"

	"github.com/tengge1/shadoweditor/helper"
)

var (
	// Config config cache
	Config *helper.ConfigModel
	// Logger create logs
	Logger *helper.Logger
)

// Create create a context
func Create(path string) error {
	// config
	config, err := helper.GetConfig(path)
	if err != nil {
		return err
	}
	Config = config

	// logger
	logger, err := helper.NewLogger(config.Log.File)
	if err != nil {
		return err
	}
	Logger = logger

	return nil
}

// Mongo get a new mongo client
func Mongo() (*helper.Mongo, error) {
	if Config == nil {
		return nil, fmt.Errorf("config is not initialized")
	}
	return helper.NewMongo(Config.Database.Connection, Config.Database.Database)
}
