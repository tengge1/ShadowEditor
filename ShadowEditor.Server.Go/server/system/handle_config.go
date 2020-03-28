package system

import (
	"context"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	config := Config{}
	base.Register("/api/Config/List", config.Get)
}

// Config 配置控制器
type Config struct {
	config helper.Config
}

// Get 获取配置信息
func (config Config) Get(w http.ResponseWriter, r *http.Request) {
	db, err := helper.Mongo(config.config.Database.Connection, config.config.Database.Database)
	if err != nil {
		base.Write(w, err.Error())
	}

	collection := db.Collection(base.ConfigCollectionName)

	result := collection.FindOne(context.TODO(), bson.M{})

	_ = result

	w.Write([]byte("Hello, config!"))
}
