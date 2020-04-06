package system

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/dimfeld/httptreemux"
	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"github.com/tengge1/shadoweditor/model/system"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	department := Department{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Department/List", department.List)
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

// Add 添加
func (Department) Add(w http.ResponseWriter, r *http.Request) {
	params := httptreemux.ContextParams(r.Context())

	parentID := params["ParentID"]
	name := params["Name"]
	adminID := params["AdminID"]

	if strings.Trim(name, " ") == "" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	doc := bson.M{
		"ID":       primitive.NewObjectID(),
		"ParentID": parentID,
		"Name":     name,
		"AdminID":  adminID,
		"Status":   0,
	}

	db.InsertOne(shadow.DepartmentCollectionName, doc)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}
