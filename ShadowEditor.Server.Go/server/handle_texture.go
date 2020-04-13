// +build ignore

package server

import (
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/tengge1/shadoweditor/model/animation"
	"github.com/tengge1/shadoweditor/model/category"

	"go.mongodb.org/mongo-driver/bson/primitive"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/context"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/model"
	"go.mongodb.org/mongo-driver/bson"
)

func init() {
	texture := Texture{}
	context.Mux.UsingContext().Handle(http.MethodGet, "/api/Map/List", texture.List)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Add", texture.Add)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Edit", texture.Edit)
	context.Mux.UsingContext().Handle(http.MethodPost, "/api/Map/Delete", texture.Delete)
}

// Texture 贴图控制器
type Texture struct {
}

// List 获取列表
func (Texture) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	db, err := context.Mongo()
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg: err.Error(),
		})
		return
	}

    // 获取所有类别
    filter := bson.M{
		"Type", "Map",
	}
	categories := []category.Model{}
    mongo.FindMany(shadow.CategoryCollectionName, filter, &categories)

	docs := bson.A{}
	opts := options.FindOptions{
		Sort: bson.M{
			"Name": 1,
		}
	}

    if context.Config.Authority.Enabled {
        user := context.GetCurrentUser();

        if user != null {
            filter1 := bson.M{
				"UserID": user.ID,
			}

            if user.Name == "Administrator" {
                filter1 = bson.M{
					"$or": bson.A{
						filter1,
						bson.M{
							"UserID": bson.M{
								"$exists": 0,
							},
						},
					},
				}
            }
            db.FindMany(shadow.MapCollectionName, filter1, &docs, &opts)
        }
    } else {
        db.FindAll(Constant.MapCollectionName, &docs, &opts)
    }

    list := []texture.Model{}

    for _, i := range docs {
        var categoryID = "";
        var categoryName = "";

        if (i.Contains("Category") && !i["Category"].IsBsonNull && !string.IsNullOrEmpty(i["Category"].ToString()))
        {
            var doc = categories.Where(n => n["_id"].ToString() == i["Category"].ToString()).FirstOrDefault();
            if (doc != null)
            {
                categoryID = doc["_id"].ToString();
                categoryName = doc["Name"].ToString();
            }
        }

        var builder = new StringBuilder();

        if (i["Url"].IsBsonDocument) // 立体贴图
        {
            builder.Append($"{i["Url"]["PosX"].AsString};");
            builder.Append($"{i["Url"]["NegX"].AsString};");
            builder.Append($"{i["Url"]["PosY"].AsString};");
            builder.Append($"{i["Url"]["NegY"].AsString};");
            builder.Append($"{i["Url"]["PosZ"].AsString};");
            builder.Append($"{i["Url"]["NegZ"].AsString};");
        }
        else // 其他贴图
        {
            builder.Append(i["Url"].AsString);
        }

        var info = new MapModel
        {
            ID = i["ID"].AsObjectId.ToString(),
            Name = i["Name"].AsString,
            CategoryID = categoryID,
            CategoryName = categoryName,
            TotalPinYin = i["TotalPinYin"].ToString(),
            FirstPinYin = i["FirstPinYin"].ToString(),
            Type = i["Type"].AsString,
            Url = builder.ToString().TrimEnd(';'),
            CreateTime = i["CreateTime"].ToUniversalTime(),
            UpdateTime = i["UpdateTime"].ToUniversalTime(),
            Thumbnail = i["Thumbnail"].ToString()
        };
        list.Add(info);
    }

    return Json(new
    {
        Code = 200,
        Msg = "Get Successfully!",
        Data = list
    });
}

// Add 添加
func (Texture) Add(w http.ResponseWriter, r *http.Request) {

}

// Edit 编辑
func (Texture) Edit(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
	if err != nil {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "ID is not allowed.",
		})
	}
	name := strings.TrimSpace(r.FormValue("Name"))
	description := strings.TrimSpace(r.FormValue("Description"))

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

	// 判断是否是系统内置角色
	filter := bson.M{
		"ID": id,
	}
	doc := bson.M{}
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "Modifying system built-in roles is not allowed.",
		})
		return
	}

	// 更新用户信息
	update := bson.M{
		"$set": bson.M{
			"Name":        name,
			"UpdateTime":  time.Now(),
			"Description": description,
		},
	}

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Saved successfully!",
	})
}

// Delete 删除
func (Texture) Delete(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	id, err := primitive.ObjectIDFromHex(r.FormValue("ID"))
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
		"ID": id,
	}

	doc := bson.M{}
	find, _ := db.FindOne(shadow.RoleCollectionName, filter, &doc)

	if !find {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "The role is not existed.",
		})
		return
	}

	roleName := doc["Name"].(string)

	if roleName == "Administrator" || roleName == "User" || roleName == "Guest" {
		helper.WriteJSON(w, model.Result{
			Code: 300,
			Msg:  "It is not allowed to delete system built-in roles.",
		})
	}

	update := bson.M{
		"$set": bson.M{
			"Status": -1,
		},
	}

	db.UpdateOne(shadow.RoleCollectionName, filter, update)

	helper.WriteJSON(w, model.Result{
		Code: 200,
		Msg:  "Delete successfully!",
	})
}
