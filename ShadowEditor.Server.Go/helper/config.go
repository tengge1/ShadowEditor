package helper

import (
	"os"

	"github.com/spf13/viper"
)

// GetConfig get config from config.toml
func GetConfig(path string) (config *Config, err error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	viper.SetConfigType("toml")

	err = viper.ReadConfig(file)
	if err != nil {
		return nil, err
	}

	config = new(Config)

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

// Config shadoweditor config
type Config struct {
	Server    ServerConfig
	Database  DatabaseConfig
	Authority AuthorityConfig
	Remote    RemoteConfig
	Log       LogConfig
}

// ServerConfig server config
type ServerConfig struct {
	Port string
}

// DatabaseConfig database config
type DatabaseConfig struct {
	Type       string
	Connection string
	Database   string
}

// AuthorityConfig authority config
type AuthorityConfig struct {
	Enabled bool
	Expires int
}

// RemoteConfig remote config
type RemoteConfig struct {
	Enabled       bool
	WebSocketPort int
}

// LogConfig log config
type LogConfig struct {
	File string
}
