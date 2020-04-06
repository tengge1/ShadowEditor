package system

import (
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"

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
	r.ParseForm()
	parentID := r.FormValue("ParentID")
	name := strings.Trim(r.FormValue("Name"), " ")
	adminID := r.FormValue("AdminID")

	if name == "" {
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

// Edit 编辑
func (Department) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id := r.FormValue("ID")
	parentID := r.FormValue("ParentID")
	name := r.FormValue("Name")
	adminID := r.FormValue("AdminID")

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
		return
	}

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

	filter := bson.M{
		"ID": objectID,
	}

	update1 := bson.M{
		"$set": bson.M{
			"ParentID": parentID,
		},
	}
	update2 := bson.M{
		"$set": bson.M{
			"Name": name,
		},
	}
	update3 := bson.M{
		"$set": bson.M{
			"AdminID": adminID,
		},
	}
	update := bson.A{update1, update2, update3}

	_, err = db.UpdateOne(shadow.DepartmentCollectionName, filter, update)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	helper.WriteJSON(w, model.Result{
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
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
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

	filter := bson.M{
		"ID": objectID,
	}

	doc, err := db.FindOne(shadow.DepartmentCollectionName, filter)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if doc == nil {
		helper.WriteJSON(w, model.Result{
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

	db.UpdateOne(shadow.DepartmentCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
