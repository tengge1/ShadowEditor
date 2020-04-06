package system

import (
	"net/http"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"github.com/tengge1/shadoweditor/model/system"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	department := Department{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Department/Get", department.List)
}

// Department 组织机构控制器
type Department struct {
}

// List 获取列表
func (Department) List(w http.ResponseWriter, r *http.Request) {
	db, err := context.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	// 获取所有用户
	users := []system.User{}

	err = db.FindMany(shadow.UserCollectionName, bson.M{}, &users)
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	// 获取所有机构
	filter := bson.M{
		"Status": 0,
	}

	list := []system.Department{}

	err = db.FindMany(shadow.DepartmentCollectionName, filter, &list)
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	for _, dept := range list {
		adminID := dept.AdminID
		var admin system.User

		for _, user := range users {
			if user.ID == adminID {
				admin = user
				break
			}
		}

		dept.AdminID = adminID
		dept.AdminName = admin.Name
	}

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}
