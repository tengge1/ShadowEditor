package helper

import "testing"

func TestConfig(t *testing.T) {
	config, err := GetConfig("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}
	t.Logf("server.port: %v", config.Server.Port)

	t.Logf("database.type: %v", config.Database.Type)
	t.Logf("database.connection: %v", config.Database.Connection)
	t.Logf("database.database: %v", config.Database.Database)

	t.Logf("authority.enabled: %v", config.Authority.Enabled)
	t.Logf("authority.expires: %v", config.Authority.Expires)

	t.Logf("upload.max_size: %v", config.Upload.MaxSize)

	t.Logf("remote.enabled: %v", config.Remote.Enabled)
	t.Logf("remote.web_socket_port: %v", config.Remote.WebSocketPort)

	t.Logf("log.file: %v", config.Log.File)
}
