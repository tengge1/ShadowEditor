package server

import (
	"net/http"

	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/server/base"
)

func init() {
	category := Category{}
	base.Register("/api/Category/List", http.MethodGet, category.List)
}

// Category 类别控制器
type Category struct {
}

// List 获取列表
func (Category) List(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		base.Write(w, err.Error())
		return
	}

	_ = db
}

// Save 保存
func (Category) Save(w http.ResponseWriter, r *http.Request) {
}
