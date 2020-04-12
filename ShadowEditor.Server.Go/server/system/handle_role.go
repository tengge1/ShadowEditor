package system

import (
	"strconv"
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
	role := Role{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Role/List", role.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Add", role.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Edit", role.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Role/Delete", role.Delete)
}

// Role 角色控制器
type Role struct {
}

// List 获取列表
func (Role) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if pageSize, err := strconv.Atoi(r.FormValue("pageSize")); err != nil {
		pageSize = 20
	}
	if pageNum, err := strconv.Atoi(r.FormValue("pageNum")); err != nil {
		pageNum = 1
	}
	keyword := strings.TrimSpace(r.FormValue("keyword"))

	db, err = context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg: err.Error(),
		})
		return
	}
	
	filter := bson.M{
		"$ne": bson.M {
			"Status": -1,
		},
	}
	
	if keyword != "" {
		filter1 := bson.M{
			"$regex": {
				bson.M {
					"Name": "/" + keyword + "/i",
				},
			},
		}
		filter = bson.M{
			"$and": bson.A{
				filter, 
				filter1,
			},
		}
	}
	
	sort = Builders<BsonDocument>.Sort.Descending("ID");

    total := mongo.Count(Constant.RoleCollectionName, filter);
	docs := mongo.FindMany(Constant.RoleCollectionName, filter)
	    .Sort(sort)
                .Skip(pageSize * (pageNum - 1))
                .Limit(pageSize)
                .ToList();

    rows = new List<RoleModel>();

    foreach (var doc in docs)
    {
        rows.Add(new RoleModel
        {
            ID = doc["ID"].ToString(),
            Name = doc["Name"].ToString(),
            CreateTime = doc["CreateTime"].ToLocalTime(),
            UpdateTime = doc["UpdateTime"].ToLocalTime(),
            Description = doc.Contains("Description") ? doc["Description"].ToString() : "",
            Status = doc["Status"].ToInt32(),
        });
    }

    return Json(new
    {
        Code = 200,
        Msg = "Get Successfully!",
        Data = new
        {
            total,
            rows,
        },
    });
}

// Add 添加
func (Role) Add(w http.ResponseWriter, r *http.Request) {
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
func (Role) Edit(w http.ResponseWriter, r *http.Request) {
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
func (Role) Delete(w http.ResponseWriter, r *http.Request) {
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

	var doc = bson.M{}
	find, err := db.FindOne(shadow.DepartmentCollectionName, filter, &doc)
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	if !find {
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
