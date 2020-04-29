package department

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
	"github.com/tengge1/shadoweditor/server/system/model"
)

func init() {
	department := Department{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Department/List", department.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Department/Add", department.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Department/Edit", department.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Department/Delete", department.Delete)
}

// Department 组织机构控制器
type Department struct {
}

// List 获取列表
func (Department) List(w http.ResponseWriter, r *http.Request) {
	db, err := server.Mongo()
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	// 获取所有用户
	users := []model.User{}

	err = db.FindMany(server.UserCollectionName, bson.M{}, &users)
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	// 获取所有机构
	filter := bson.M{
		"Status": 0,
	}

	list := []model.Department{}

	err = db.FindMany(server.DepartmentCollectionName, filter, &list)
	if err != nil {
		helper.Write(w, err.Error())
		return
	}

	for key := range list {
		adminID := list[key].AdminID
		var admin model.User

		for _, user := range users {
			if user.ID == adminID {
				admin = user
				break
			}
		}

		list[key].AdminID = adminID
		list[key].AdminName = admin.Name
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Add 添加
func (Department) Add(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	parentID := r.FormValue("ParentID")
	name := strings.TrimSpace(r.FormValue("Name"))
	adminID := strings.TrimSpace(r.FormValue("AdminID"))

	if name == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	objAdminID, _ := primitive.ObjectIDFromHex(adminID)

	doc := bson.M{
		"ID":       primitive.NewObjectID(),
		"ParentID": parentID,
		"Name":     name,
		"AdminID":  objAdminID,
		"Status":   0,
	}

	db.InsertOne(server.DepartmentCollectionName, doc)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Edit 编辑
func (Department) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id := r.FormValue("ID")
	parentID := r.FormValue("ParentID")
	name := r.FormValue("Name")
	adminID := r.FormValue("AdminID")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	if strings.Trim(name, " ") == "" {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "Name is not allowed to be empty.",
		})
		return
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": objectID,
	}
	update := bson.M{
		"$set": bson.M{
			"ParentID": parentID,
			"Name":     name,
			"AdminID":  adminID,
		},
	}

	_, err = db.UpdateOne(server.DepartmentCollectionName, filter, update)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Department) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id := r.FormValue("ID")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	filter := bson.M{
		"ID": objectID,
	}

	var doc = bson.M{}
	find, err := db.FindOne(server.DepartmentCollectionName, filter, &doc)
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if !find {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  "The department is not existed.",
		})
		return
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(server.DepartmentCollectionName, filter, update)

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
