package helper

import (
	"os"

	"github.com/BurntSushi/toml"
)

// GetConfig get config from config.toml
func GetConfig(path string) (config *ConfigModel, err error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	_, err = toml.DecodeReader(file, &config)
	if err != nil {
		return nil, err
	}

	return
}

// ConfigModel shadoweditor config
type ConfigModel struct {
	Server    ServerConfigModel    `toml:"server"`
	Database  DatabaseConfigModel  `toml:"database"`
	Authority AuthorityConfigModel `toml:"authority"`
	Upload    UploadConfigModel    `toml:"upload"`
	Remote    RemoteConfigModel    `toml:"remote"`
	Log       LogConfigModel       `toml:"log"`
}

// ServerConfigModel server config
type ServerConfigModel struct {
	Port string `toml:"port"`
}

// DatabaseConfigModel database config
type DatabaseConfigModel struct {
	Type       string `toml:"type"`
	Connection string `toml:"connection"`
	Database   string `toml:"database"`
}

// AuthorityConfigModel authority config
type AuthorityConfigModel struct {
	Enabled bool `toml:"enabled"`
	Expires int  `toml:"expires"`
}

// UploadConfigModel upload config
type UploadConfigModel struct {
	MaxSize int64 `toml:"max_size"`
}

// RemoteConfigModel remote config
type RemoteConfigModel struct {
	Enabled       bool `toml:"enabled"`
	WebSocketPort int  `toml:"web_socket_port"`
}

// LogConfigModel  log config
type LogConfigModel struct {
	File string `toml:"file"`
}
