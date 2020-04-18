package mesh

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"

	shadow "github.com/tengge1/shadoweditor"
	"github.com/tengge1/shadoweditor/helper"
	"github.com/tengge1/shadoweditor/server"
	"github.com/tengge1/shadoweditor/server/category"
)

func init() {
	mesh := Mesh{}
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Mesh/List", mesh.List)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Add", mesh.Add)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Edit", mesh.Edit)
	server.Mux.UsingContext().Handle(http.MethodPost, "/api/Mesh/Delete", mesh.Delete)
	server.Mux.UsingContext().Handle(http.MethodGet, "/api/Mesh/Download", mesh.Download)
}

// Mesh 网格控制器
type Mesh struct {
}

// List 获取列表
func (Mesh) List(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()

	db, err := server.Mongo()
	if err != nil {
		helper.WriteJSON(w, server.Result{
			Code: 300,
			Msg:  err.Error(),
		})
		return
	}

	// 获取所有类别
	filter := bson.M{
		"Type": "Mesh",
	}
	categories := []category.Model{}
	db.FindMany(shadow.CategoryCollectionName, filter, &categories)

	docs := bson.A{}

	opts := options.FindOptions{
		Sort: bson.M{
			"_id": -1,
		},
	}

	if server.Config.Authority.Enabled {
		user, _ := server.GetCurrentUser(r)

		if user != nil {
			filter1 := bson.M{
				"UserID": user.ID,
			}

			if user.Name == "Administrator" {
				filter2 := bson.M{
					"UserID": bson.M{
						"$exists": 0,
					},
				}
				filter1 = bson.M{
					"$or": bson.A{
						filter1,
						filter2,
					},
				}
			}
			db.FindMany(shadow.MeshCollectionName, filter1, &docs, &opts)
		}
	} else {
		db.FindAll(shadow.MeshCollectionName, &docs, &opts)
	}

	list := []Model{}
	for _, i := range docs {
		doc := i.(primitive.D).Map()
		categoryID := ""
		categoryName := ""

		if doc["Category"] != nil {
			for _, category := range categories {
				if category.ID == doc["Category"].(string) {
					categoryID = category.ID
					categoryName = category.Name
					break
				}
			}
		}

		thumbnail, _ := doc["Thumbnail"].(string)

		info := Model{
			ID:           doc["_id"].(primitive.ObjectID).Hex(),
			Name:         doc["Name"].(string),
			CategoryID:   categoryID,
			CategoryName: categoryName,
			TotalPinYin:  helper.PinYinToString(doc["TotalPinYin"]),
			FirstPinYin:  helper.PinYinToString(doc["FirstPinYin"]),
			Type:         doc["Type"].(string),
			URL:          doc["Url"].(string),
			// CreateTime:   doc["CreateTime"].(primitive.DateTime).Time(),
			// UpdateTime:   doc["UpdateTime"].(primitive.DateTime).Time(),
			Thumbnail: thumbnail,
		}

		list = append(list, info)
	}

	helper.WriteJSON(w, server.Result{
		Code: 200,
		Msg:  "Get Successfully!",
		Data: list,
	})
}

// Add 添加
func (Mesh) Add(w http.ResponseWriter, r *http.Request) {

}

// Edit 编辑
func (Mesh) Edit(w http.ResponseWriter, r *http.Request) {

}

// Delete 删除
func (Mesh) Delete(w http.ResponseWriter, r *http.Request) {

}

// Download 下载
func (Mesh) Download(w http.ResponseWriter, r *http.Request) {

}
