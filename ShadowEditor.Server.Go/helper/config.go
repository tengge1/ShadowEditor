package helper

import (
	"os"

	"github.com/spf13/viper"
)

var (
	// Config config cache
	Config *ConfigModel
)

// GetConfig get config from config.toml
func GetConfig(path string) (config *ConfigModel, err error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	viper.SetConfigType("toml")

	err = viper.ReadConfig(file)
	if err != nil {
		return nil, err
	}

	config = new(ConfigModel)

	server := viper.Sub("server")
	config.Server.Port = server.GetString("port")

	database := viper.Sub("database")
	config.Database.Type = database.GetString("type")
	config.Database.Connection = database.GetString("connection")
	config.Database.Database = database.GetString("database")

	authority := viper.Sub("authority")
	config.Authority.Enabled = authority.GetBool("enabled")
	config.Authority.Expires = authority.GetInt("expires")

	remote := viper.Sub("remote")
	config.Remote.Enabled = remote.GetBool("enabled")
	config.Remote.WebSocketPort = remote.GetInt("web_socket_port")

	log := viper.Sub("log")
	config.Log.File = log.GetString("file")

	return config, nil
}

// ConfigModel shadoweditor config
type ConfigModel struct {
	Server    ServerConfigModel
	Database  DatabaseConfigModel
	Authority AuthorityConfigModel
	Remote    RemoteConfigModel
	Log       LogConfigModel
}

// ServerConfigModel server config
type ServerConfigModel struct {
	Port string
}

// DatabaseConfigModel database config
type DatabaseConfigModel struct {
	Type       string
	Connection string
	Database   string
}

// AuthorityConfigModel authority config
type AuthorityConfigModel struct {
	Enabled bool
	Expires int
}

// RemoteConfigModel remote config
type RemoteConfigModel struct {
	Enabled       bool
	WebSocketPort int
}

// LogConfigModel  log config
type LogConfigModel struct {
	File string
}
