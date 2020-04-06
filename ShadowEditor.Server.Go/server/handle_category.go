package server

import (
	"net/http"

	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
)

func init() {
	category := Category{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Category/List", category.List)
}

// Category 类别控制器
type Category struct {
}

// List 获取列表
func (Category) List(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	_ = db
}

// Save 保存
func (Category) Save(w http.ResponseWriter, r *http.Request) {
}
